-- Perfil em public.users criado pelo banco no signup (e email sincronizado).
-- QUANDO RODAR: logo DEPOIS do deploy do front novo, junto com o 05.
-- (O front antigo faz insert em users depois do signUp; com este trigger ativo,
-- esse insert daria chave duplicada.)

begin;

-- O front manda os dados do perfil em signUp({ options: { data } }), que vira
-- raw_user_meta_data. Esses dados vêm do usuário: a lista de colunas é fixa e
-- id/email sempre vêm de new.id/new.email, nunca do metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.users (
    id, email, name,
    address_cep, address_street, address_number, address_district,
    address_city, address_state, address_country
  )
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(meta->>'name'), ''), split_part(new.email, '@', 1)),
    meta->>'address_cep',
    meta->>'address_street',
    meta->>'address_number',
    meta->>'address_district',
    meta->>'address_city',
    meta->>'address_state',
    meta->>'address_country'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Troca de email só vale depois que o usuário confirma (auth.users muda nessa hora),
-- então o users.email acompanha o auth em vez de ser gravado pelo front.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.users set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

commit;
