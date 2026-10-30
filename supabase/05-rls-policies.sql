-- Permissões e RLS: cada usuário só lê e altera o que é seu.
-- QUANDO RODAR: logo DEPOIS do deploy do front novo, junto com o 01.
-- (O front antigo grava pedidos e marca produto como vendido direto na tabela;
-- isso passa a ser bloqueado aqui.)
--
-- Como estava (inspeção de 29/10/2026):
--   - orders: select e insert liberados pra qualquer um -> endereço de todo comprador público
--   - users: select liberado -> email e endereço de todo usuário público
--   - favorites: delete liberado -> qualquer um apagava favorito de qualquer um
--   - products: insert liberado (até sem login, com qualquer vendor_id) e a policy de
--     "marcar como vendido" deixava alterar qualquer coluna de produto não vendido
--
-- Policies se somam com OR, então primeiro saem todas as antigas.

begin;

-- 1. Policies antigas -------------------------------------------------------
drop policy if exists "update_user" on public.users;
drop policy if exists "Allow authenticated users access to their own data" on public.users;
drop policy if exists "public can read users" on public.users;

drop policy if exists "Enable select for public in sales" on public.orders;
drop policy if exists "Enable insert for public in sales" on public.orders;

drop policy if exists "insert reviews" on public.reviews;
drop policy if exists "select reviews" on public.reviews;

drop policy if exists "remove favorite" on public.favorites;
drop policy if exists "select favorites" on public.favorites;
drop policy if exists "insert favorite" on public.favorites;

drop policy if exists "Allow product updates for vendors" on public.products;
drop policy if exists "Change product to sold when buy" on public.products;
drop policy if exists "Enable delete for users based on vendor_id" on public.products;
drop policy if exists "create product" on public.products;
drop policy if exists "public can read products" on public.products;

-- 2. Grants: só as operações e colunas que o app usa -------------------------
-- Grant por coluna impede o cliente de mudar id, vendor_id, sold, email etc.,
-- mesmo na própria linha. A RPC purchase_products roda como dono e não é afetada.
revoke all on public.users, public.products, public.orders, public.reviews, public.favorites
  from anon, authenticated;

grant select on public.products, public.reviews to anon, authenticated;

grant select,
      update (name, avatar, address_cep, address_street, address_number,
              address_district, address_city, address_state, address_country)
  on public.users to authenticated;

grant insert (id, name, description, price, image_url, vendor_id),
      update (name, description, price, image_url),
      delete
  on public.products to authenticated;

grant select on public.orders to authenticated;

grant insert (user_id, vendor_id, product_id, title, review, stars)
  on public.reviews to authenticated;

grant select, insert (user_id, product_id), delete
  on public.favorites to authenticated;

-- 3. Policies novas ----------------------------------------------------------
alter table public.users     enable row level security;
alter table public.products  enable row level security;
alter table public.orders    enable row level security;
alter table public.reviews   enable row level security;
alter table public.favorites enable row level security;

-- users: só a própria linha (o insert é feito pelo trigger do 01).
create policy "users_select_own" on public.users
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "users_update_own" on public.users
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- products: vitrine pública; vendedor cria, edita e apaga só os seus, e só enquanto não vendidos.
create policy "products_select_all" on public.products
  for select to anon, authenticated
  using (true);

create policy "products_insert_own" on public.products
  for insert to authenticated
  with check ((select auth.uid()) = vendor_id);

create policy "products_update_own_unsold" on public.products
  for update to authenticated
  using ((select auth.uid()) = vendor_id and sold = false)
  with check ((select auth.uid()) = vendor_id);

create policy "products_delete_own_unsold" on public.products
  for delete to authenticated
  using ((select auth.uid()) = vendor_id and sold = false);

-- orders: comprador vê os seus pedidos, vendedor vê os pedidos dos seus produtos.
-- Sem insert/update/delete: pedido só nasce pela RPC purchase_products.
create policy "orders_select_buyer_or_vendor" on public.orders
  for select to authenticated
  using (
    buyer_id = (select auth.uid())
    or exists (
      select 1 from public.products p
       where p.id = orders.product_id
         and p.vendor_id = (select auth.uid())
    )
  );

-- reviews: leitura pública; só avalia quem comprou aquele produto daquele vendedor.
create policy "reviews_select_all" on public.reviews
  for select to anon, authenticated
  using (true);

create policy "reviews_insert_buyer" on public.reviews
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1
        from public.orders o
        join public.products p on p.id = o.product_id
       where o.buyer_id = (select auth.uid())
         and o.product_id = reviews.product_id
         and p.vendor_id = reviews.vendor_id
    )
  );

-- favorites: cada um mexe só nos seus.
create policy "favorites_select_own" on public.favorites
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "favorites_insert_own" on public.favorites
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "favorites_delete_own" on public.favorites
  for delete to authenticated
  using (user_id = (select auth.uid()));

commit;
