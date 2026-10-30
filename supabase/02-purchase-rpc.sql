-- Compra feita pelo banco, numa transação só.
-- QUANDO RODAR: ANTES do deploy do front novo (é aditivo, o front antigo não usa).
--
-- Antes, o front gravava o pedido (com preço e vendedor vindos do navegador) e
-- depois marcava o produto como vendido, em duas requisições. Dava pra comprar
-- item já vendido, o próprio item, ou gravar qualquer preço.
-- Aqui, preço, snapshot do produto, comprador e endereço vêm do banco.

begin;

create or replace function public.purchase_products(p_product_ids text[])
returns setof public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ids text[];
  v_available int;
  v_address jsonb;
  v_order_ids uuid[];
begin
  if v_uid is null then
    raise exception 'Faça login para comprar.' using errcode = '28000';
  end if;

  select array_agg(distinct id) into v_ids from unnest(p_product_ids) as id;
  if v_ids is null then
    raise exception 'Nenhum produto informado.' using errcode = '22023';
  end if;

  -- Endereço do perfil do comprador (o checkout salva o endereço no perfil antes de comprar).
  select jsonb_build_object(
           'cep', u.address_cep,
           'street', u.address_street,
           'number', u.address_number,
           'district', u.address_district,
           'city', u.address_city,
           'state', u.address_state,
           'country', u.address_country
         )
    into v_address
    from public.users u
   where u.id = v_uid
     and coalesce(u.address_cep, '') <> ''
     and coalesce(u.address_street, '') <> ''
     and coalesce(u.address_number, '') <> '';

  if v_address is null then
    raise exception 'Cadastre um endereço de entrega antes de comprar.' using errcode = '22023';
  end if;

  -- Trava as linhas: dois compradores ao mesmo tempo não passam os dois.
  perform 1 from public.products where id = any(v_ids) for update;

  select count(*) into v_available
    from public.products
   where id = any(v_ids)
     and sold = false
     and vendor_id <> v_uid;

  if v_available <> cardinality(v_ids) then
    raise exception 'Algum produto não está mais disponível.' using errcode = 'P0001';
  end if;

  with sold_now as (
    update public.products
       set sold = true
     where id = any(v_ids)
    returning *
  ),
  created as (
    insert into public.orders (buyer_id, product_id, product, total, address)
    select v_uid,
           s.id,
           jsonb_build_object(
             'name', s.name,
             'price', s.price,
             'pictures', to_jsonb(s.image_url),
             'vendor_id', s.vendor_id,
             'description', s.description
           ),
           s.price,
           v_address
      from sold_now s
    returning id
  )
  select array_agg(id) into v_order_ids from created;

  return query select * from public.orders where id = any(v_order_ids);
end;
$$;

revoke execute on function public.purchase_products(text[]) from public, anon;
grant execute on function public.purchase_products(text[]) to authenticated;

commit;
