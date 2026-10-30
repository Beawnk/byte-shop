-- Regras de integridade que o front só checava na tela.
-- QUANDO RODAR: ANTES do deploy do front novo (é aditivo).
--
-- Se algum ALTER falhar por dado existente que já viola a regra, nada é aplicado
-- (está tudo numa transação). Rode as consultas abaixo pra achar o que limpar:
--
--   select user_id, product_id, count(*) from public.reviews   group by 1, 2 having count(*) > 1;
--   select user_id, product_id, count(*) from public.favorites group by 1, 2 having count(*) > 1;
--   select product_id, count(*)          from public.orders    group by 1    having count(*) > 1;
--   select id, stars from public.reviews where stars not between 1 and 5;

begin;

-- Uma avaliação por produto por usuário, nota de 1 a 5.
alter table public.reviews
  add constraint reviews_stars_range check (stars between 1 and 5),
  add constraint reviews_user_product_key unique (user_id, product_id);

-- Favoritar duas vezes o mesmo produto não cria linha duplicada.
alter table public.favorites
  add constraint favorites_user_product_key unique (user_id, product_id);

-- Cada produto é único: só pode ter um pedido.
alter table public.orders
  add constraint orders_product_key unique (product_id);

-- Defaults que fazem sentido (antes: vendor_id tinha um uuid fixo de default,
-- sold não tinha default e buyer_id gerava um uuid aleatório).
alter table public.products
  alter column sold set default false,
  alter column vendor_id set default auth.uid();
alter table public.reviews   alter column user_id set default auth.uid();
alter table public.favorites alter column user_id set default auth.uid();
alter table public.orders    alter column buyer_id drop default;

commit;
