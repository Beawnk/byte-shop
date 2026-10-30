-- Perfil público: só o que a vitrine precisa mostrar de um vendedor/avaliador.
-- QUANDO RODAR: ANTES do deploy do front novo (é aditivo).
--
-- Depois do 05, a tabela users só é legível pelo próprio dono (email e endereço
-- são dados pessoais). A view roda com os privilégios do dono dela (postgres),
-- então passa pelo RLS de users, mas só expõe estas 3 colunas.
-- O linter do Supabase avisa "security definer view": aqui é intencional.

begin;

create or replace view public.public_profiles as
  select id, name, avatar
    from public.users;

revoke all on public.public_profiles from anon, authenticated;
grant select on public.public_profiles to anon, authenticated;

commit;
