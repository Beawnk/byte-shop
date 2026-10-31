-- Medição das imagens antes de migrar pro Storage: quantas são base64, quantas já são URLs
-- do Storage ou externas, e quais buckets e policies existem hoje.
-- Só lê dados e devolve só contagens e tamanhos. Roda tudo de uma vez no SQL Editor e
-- devolve um único resultado: use "Export > Copy as JSON" (ou CSV) e cole na conversa.

with product_images as (
  select p.id::text as row_id, img
  from public.products p
  cross join lateral jsonb_array_elements_text(
    case when jsonb_typeof(to_jsonb(p.image_url)) = 'array' then to_jsonb(p.image_url) else '[]'::jsonb end
  ) as img
),
order_images as (
  select o.id::text as row_id, img
  from public.orders o
  cross join lateral jsonb_array_elements_text(
    case when jsonb_typeof(o.product::jsonb -> 'pictures') = 'array' then o.product::jsonb -> 'pictures' else '[]'::jsonb end
  ) as img
),
avatars as (
  select u.id::text as row_id, u.avatar as img
  from public.users u
  where u.avatar is not null and u.avatar <> ''
),
images as (
  select 'products' as origem, row_id, img from product_images
  union all
  select 'orders', row_id, img from order_images
  union all
  select 'users.avatar', row_id, img from avatars
),
classified as (
  select
    origem,
    row_id,
    octet_length(img) as bytes,
    case
      when img like 'data:%' then 'base64'
      when img like '%.supabase.co/storage/%' then 'storage'
      else 'externa'
    end as tipo
  from images
)
select
  origem,
  tipo,
  count(*) as imagens,
  count(distinct row_id) as linhas,
  round(sum(bytes) / 1048576.0, 2) as mb,
  round(max(bytes) / 1024.0) as maior_kb
from classified
group by origem, tipo

union all
select
  'bucket ' || b.id,
  case when b.public then 'publico' else 'privado' end,
  count(o.id),
  0,
  coalesce(round(sum((o.metadata ->> 'size')::bigint) / 1048576.0, 2), 0),
  coalesce(round(max((o.metadata ->> 'size')::bigint) / 1024.0), 0)
from storage.buckets b
left join storage.objects o on o.bucket_id = b.id
group by b.id, b.public

union all
select 'policy ' || policyname, cmd, 0, 0, 0, 0
from pg_policies
where schemaname = 'storage' and tablename = 'objects'

order by 1, 2;
