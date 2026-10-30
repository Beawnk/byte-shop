-- Inspeção do schema, RLS e policies antes de qualquer mudança.
-- Só lê metadados (nenhum dado de usuário). Roda tudo de uma vez no SQL Editor
-- e devolve um único resultado: use "Export > Copy as JSON" (ou CSV) e cole na conversa.

select 'rls' as section, jsonb_build_object(
  'table', c.relname,
  'rls_enabled', c.relrowsecurity,
  'rls_forced', c.relforcerowsecurity
) as item
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'

union all
select 'policy', jsonb_build_object(
  'schema', schemaname,
  'table', tablename,
  'name', policyname,
  'permissive', permissive,
  'roles', roles,
  'cmd', cmd,
  'using', qual,
  'with_check', with_check
)
from pg_policies
where schemaname in ('public', 'storage')

union all
select 'column', jsonb_build_object(
  'table', table_name,
  'column', column_name,
  'type', udt_name,
  'nullable', is_nullable,
  'default', column_default
)
from information_schema.columns
where table_schema = 'public'

union all
select 'constraint', jsonb_build_object(
  'table', conrelid::regclass::text,
  'name', conname,
  'type', contype,
  'def', pg_get_constraintdef(oid)
)
from pg_constraint
where connamespace = 'public'::regnamespace

union all
select 'trigger', jsonb_build_object(
  'schema', event_object_schema,
  'table', event_object_table,
  'name', trigger_name,
  'timing', action_timing,
  'event', event_manipulation,
  'statement', action_statement
)
from information_schema.triggers
where event_object_schema in ('auth', 'public')

union all
select 'function', jsonb_build_object(
  'name', p.proname,
  'args', pg_get_function_identity_arguments(p.oid),
  'security_definer', p.prosecdef
)
from pg_proc p
where p.pronamespace = 'public'::regnamespace

union all
select 'view', jsonb_build_object('name', table_name)
from information_schema.views
where table_schema = 'public'

union all
select 'grant', jsonb_build_object(
  'table', table_name,
  'role', grantee,
  'privileges', string_agg(privilege_type, ',' order by privilege_type)
)
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
group by table_name, grantee

union all
select 'bucket', jsonb_build_object(
  'id', id,
  'public', public,
  'size_limit', file_size_limit,
  'mime_types', allowed_mime_types
)
from storage.buckets

order by 1;
