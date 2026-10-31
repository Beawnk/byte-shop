-- Impede que imagens em base64 voltem pro banco.
-- Restritivo: rodar por último, depois do deploy do front novo e de
-- scripts/migrate-images.mjs. Se ainda sobrar base64, o comando falha e nada é aplicado.

begin;

alter table public.products drop constraint if exists products_image_url_no_base64;
alter table public.products add constraint products_image_url_no_base64
  check (to_jsonb(image_url)::text not like '%"data:%');

alter table public.users drop constraint if exists users_avatar_no_base64;
alter table public.users add constraint users_avatar_no_base64
  check (avatar not like 'data:%');

commit;
