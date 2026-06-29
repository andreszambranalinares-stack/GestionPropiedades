-- =============================================================
-- ZamProp — Storage de documentos (contratos, DNIs, etc.)
-- =============================================================
-- Sustituye a IndexedDB. Los binarios se guardan en un bucket
-- PRIVADO y los metadatos en la tabla public.documents.
--
-- Convención de ruta: <group_id>/<apartment_id>/<archivo>
-- Así la primera carpeta identifica al grupo y podemos aplicar
-- RLS comprobando la pertenencia al grupo.
-- =============================================================

-- 1. Crear el bucket privado (idempotente)
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- 2. Políticas: solo miembros del grupo (carpeta raíz = group_id)
drop policy if exists "docs leer miembros" on storage.objects;
create policy "docs leer miembros" on storage.objects for select
  using (
    bucket_id = 'documentos'
    and public.is_group_member( ((storage.foldername(name))[1])::uuid )
  );

drop policy if exists "docs escribir gestores" on storage.objects;
create policy "docs escribir gestores" on storage.objects for insert
  with check (
    bucket_id = 'documentos'
    and public.can_write_group( ((storage.foldername(name))[1])::uuid )
  );

drop policy if exists "docs borrar gestores" on storage.objects;
create policy "docs borrar gestores" on storage.objects for delete
  using (
    bucket_id = 'documentos'
    and public.can_write_group( ((storage.foldername(name))[1])::uuid )
  );
