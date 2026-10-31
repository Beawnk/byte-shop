-- Bucket das imagens enviadas pelos usuários (fotos de produto e avatares).
-- Aditivo: rodar ANTES do deploy do front novo, que já envia pra cá.
--
-- É público porque essas imagens já aparecem pra qualquer visitante, então a leitura pela URL
-- pública não precisa de policy. O limite de tamanho e os formatos ficam no próprio bucket,
-- assim valem mesmo pra quem chamar a API sem passar pelo site.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cada usuário só mexe na própria pasta: o caminho é <user id>/<arquivo>.
-- O select existe porque o Storage precisa dele pra apagar um arquivo.
drop policy if exists "images: owner select" on storage.objects;
create policy "images: owner select" on storage.objects
  for select to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "images: owner insert" on storage.objects;
create policy "images: owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "images: owner delete" on storage.objects;
create policy "images: owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
