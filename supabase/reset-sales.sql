-- Apaga TODOS os pedidos e TODAS as avaliações, e coloca todos os produtos à venda de novo.
-- É irreversível: rode uma vez, ANTES de add-products.sql.
-- Não mexe em favoritos.

begin;

delete from public.reviews;

delete from public.orders;

update public.products
   set sold = false
 where sold;

commit;
