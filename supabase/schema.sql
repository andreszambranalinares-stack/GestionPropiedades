-- =============================================================
-- ZamProp — Esquema Supabase (Fase 1: cimientos)
-- =============================================================
-- Ejecuta este script completo en el SQL Editor de tu proyecto
-- Supabase (Dashboard -> SQL -> New query -> pega y Run).
--
-- Modelo: las propiedades pertenecen a GRUPOS. Un usuario puede
-- pertenecer a varios grupos con un rol (admin / gestor /
-- visualizador). Toda la seguridad se aplica con RLS por grupo.
-- =============================================================

-- -------------------------------------------------------------
-- 0. Tipos
-- -------------------------------------------------------------
do $$ begin
  create type public.group_role as enum ('admin', 'gestor', 'visualizador');
exception when duplicate_object then null; end $$;

-- -------------------------------------------------------------
-- 1. Perfiles (extiende auth.users)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombre     text,
  email      text,
  telefono   text,
  created_at timestamptz default now()
);

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nombre, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', new.email), new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- 2. Grupos
-- -------------------------------------------------------------
create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- -------------------------------------------------------------
-- 3. Miembros de grupo
-- -------------------------------------------------------------
create table if not exists public.group_members (
  group_id   uuid references public.groups(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  rol        public.group_role not null default 'visualizador',
  created_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- Al crear un grupo, el dueño entra como admin (SECURITY DEFINER salta RLS)
create or replace function public.handle_new_group()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.group_members (group_id, user_id, rol)
  values (new.id, new.owner_id, 'admin')
  on conflict (group_id, user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_group_created on public.groups;
create trigger on_group_created
  after insert on public.groups
  for each row execute function public.handle_new_group();

-- -------------------------------------------------------------
-- 4. Invitaciones
-- -------------------------------------------------------------
create table if not exists public.group_invites (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups(id) on delete cascade,
  email       text not null,
  rol         public.group_role not null default 'visualizador',
  invited_by  uuid references public.profiles(id),
  created_at  timestamptz default now(),
  accepted_at timestamptz
);

-- -------------------------------------------------------------
-- 5. Edificios / Inmuebles
-- -------------------------------------------------------------
create table if not exists public.buildings (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid not null references public.groups(id) on delete cascade,
  nombre        text not null,
  direccion     text,
  localidad     text,
  etiquetas     text[] default '{}',
  tipo_inmueble text default 'edificio',
  created_at    timestamptz default now()
);

-- -------------------------------------------------------------
-- 6. Apartamentos / Unidades
-- -------------------------------------------------------------
create table if not exists public.apartments (
  id          uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  numero      text,
  tipo        text default 'Apartamento',
  created_at  timestamptz default now()
);

-- -------------------------------------------------------------
-- 7. Inquilinos (activos e históricos en una sola tabla)
--    activo = true  -> inquilino actual de la unidad
--    activo = false -> ex-inquilino (histórico)
-- -------------------------------------------------------------
create table if not exists public.tenants (
  id            uuid primary key default gen_random_uuid(),
  apartment_id  uuid not null references public.apartments(id) on delete cascade,
  nombre        text,
  telefono      text,
  email         text,
  alquiler      numeric default 0,
  fecha_entrada date,
  fecha_salida  date,
  activo        boolean default true,
  created_at    timestamptz default now()
);

-- -------------------------------------------------------------
-- 8. Pagos
-- -------------------------------------------------------------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  apartment_id uuid not null references public.apartments(id) on delete cascade,
  tenant_id    uuid references public.tenants(id) on delete set null,
  mes          text not null,          -- 'YYYY-MM'
  pagado       boolean default true,
  fecha        date,
  importe      numeric default 0,
  created_at   timestamptz default now()
);

-- -------------------------------------------------------------
-- 9. Gastos
-- -------------------------------------------------------------
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  fecha       date,
  concepto    text,
  tipo        text,
  importe     numeric default 0,
  created_at  timestamptz default now()
);

-- -------------------------------------------------------------
-- 10. Documentos (metadatos; binarios en Supabase Storage)
-- -------------------------------------------------------------
create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  apartment_id uuid references public.apartments(id) on delete cascade,
  tenant_id    uuid references public.tenants(id) on delete set null,
  file_name    text,
  file_type    text,
  storage_path text not null,
  created_at   timestamptz default now()
);

-- =============================================================
-- FUNCIONES DE APOYO PARA RLS (SECURITY DEFINER -> evitan recursión)
-- =============================================================
create or replace function public.is_group_member(g uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.group_members
    where group_id = g and user_id = auth.uid()
  );
$$;

create or replace function public.can_write_group(g uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.group_members
    where group_id = g and user_id = auth.uid() and rol in ('admin', 'gestor')
  );
$$;

create or replace function public.is_group_admin(g uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.group_members
    where group_id = g and user_id = auth.uid() and rol = 'admin'
  ) or exists (
    select 1 from public.groups where id = g and owner_id = auth.uid()
  );
$$;

create or replace function public.shares_group(other uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.group_members a
    join public.group_members b on a.group_id = b.group_id
    where a.user_id = auth.uid() and b.user_id = other
  );
$$;

-- Resolver el grupo de un edificio / apartamento
create or replace function public.building_group(b uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select group_id from public.buildings where id = b;
$$;

create or replace function public.apartment_group(a uuid)
returns uuid language sql security definer stable set search_path = public as $$
  select bl.group_id
  from public.apartments ap
  join public.buildings bl on bl.id = ap.building_id
  where ap.id = a;
$$;

-- Aceptar una invitación (valida que el email coincida con tu cuenta)
create or replace function public.accept_invite(invite_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare inv public.group_invites;
begin
  select * into inv from public.group_invites
  where id = invite_id and accepted_at is null;

  if inv.id is null then
    raise exception 'Invitación no válida o ya aceptada';
  end if;

  if lower(inv.email) <> lower(coalesce(auth.jwt() ->> 'email', '')) then
    raise exception 'Esta invitación no es para tu cuenta';
  end if;

  insert into public.group_members (group_id, user_id, rol)
  values (inv.group_id, auth.uid(), inv.rol)
  on conflict (group_id, user_id) do nothing;

  update public.group_invites set accepted_at = now() where id = invite_id;
end; $$;

-- =============================================================
-- RLS — activar en todas las tablas (sin política = denegado)
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.groups        enable row level security;
alter table public.group_members enable row level security;
alter table public.group_invites enable row level security;
alter table public.buildings     enable row level security;
alter table public.apartments    enable row level security;
alter table public.tenants       enable row level security;
alter table public.payments      enable row level security;
alter table public.expenses      enable row level security;
alter table public.documents     enable row level security;

-- ---- profiles ----
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.shares_group(id));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---- groups ----
drop policy if exists groups_select on public.groups;
create policy groups_select on public.groups for select
  using (public.is_group_member(id));
drop policy if exists groups_insert on public.groups;
create policy groups_insert on public.groups for insert
  with check (owner_id = auth.uid());
drop policy if exists groups_update on public.groups;
create policy groups_update on public.groups for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists groups_delete on public.groups;
create policy groups_delete on public.groups for delete
  using (owner_id = auth.uid());

-- ---- group_members ----
drop policy if exists gm_select on public.group_members;
create policy gm_select on public.group_members for select
  using (public.is_group_member(group_id));
drop policy if exists gm_insert on public.group_members;
create policy gm_insert on public.group_members for insert
  with check (public.is_group_admin(group_id));
drop policy if exists gm_update on public.group_members;
create policy gm_update on public.group_members for update
  using (public.is_group_admin(group_id));
drop policy if exists gm_delete on public.group_members;
create policy gm_delete on public.group_members for delete
  using (public.is_group_admin(group_id) or user_id = auth.uid());

-- ---- group_invites ----
drop policy if exists gi_select on public.group_invites;
create policy gi_select on public.group_invites for select
  using (public.is_group_admin(group_id)
         or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
drop policy if exists gi_insert on public.group_invites;
create policy gi_insert on public.group_invites for insert
  with check (public.is_group_admin(group_id));
drop policy if exists gi_delete on public.group_invites;
create policy gi_delete on public.group_invites for delete
  using (public.is_group_admin(group_id) or invited_by = auth.uid());

-- ---- buildings ----
drop policy if exists b_select on public.buildings;
create policy b_select on public.buildings for select
  using (public.is_group_member(group_id));
drop policy if exists b_write on public.buildings;
create policy b_write on public.buildings for all
  using (public.can_write_group(group_id))
  with check (public.can_write_group(group_id));

-- ---- apartments ----
drop policy if exists ap_select on public.apartments;
create policy ap_select on public.apartments for select
  using (public.is_group_member(public.building_group(building_id)));
drop policy if exists ap_write on public.apartments;
create policy ap_write on public.apartments for all
  using (public.can_write_group(public.building_group(building_id)))
  with check (public.can_write_group(public.building_group(building_id)));

-- ---- tenants ----
drop policy if exists t_select on public.tenants;
create policy t_select on public.tenants for select
  using (public.is_group_member(public.apartment_group(apartment_id)));
drop policy if exists t_write on public.tenants;
create policy t_write on public.tenants for all
  using (public.can_write_group(public.apartment_group(apartment_id)))
  with check (public.can_write_group(public.apartment_group(apartment_id)));

-- ---- payments ----
drop policy if exists p_select on public.payments;
create policy p_select on public.payments for select
  using (public.is_group_member(public.apartment_group(apartment_id)));
drop policy if exists p_write on public.payments;
create policy p_write on public.payments for all
  using (public.can_write_group(public.apartment_group(apartment_id)))
  with check (public.can_write_group(public.apartment_group(apartment_id)));

-- ---- expenses ----
drop policy if exists e_select on public.expenses;
create policy e_select on public.expenses for select
  using (public.is_group_member(public.building_group(building_id)));
drop policy if exists e_write on public.expenses;
create policy e_write on public.expenses for all
  using (public.can_write_group(public.building_group(building_id)))
  with check (public.can_write_group(public.building_group(building_id)));

-- ---- documents ----
drop policy if exists d_select on public.documents;
create policy d_select on public.documents for select
  using (public.is_group_member(public.apartment_group(apartment_id)));
drop policy if exists d_write on public.documents;
create policy d_write on public.documents for all
  using (public.can_write_group(public.apartment_group(apartment_id)))
  with check (public.can_write_group(public.apartment_group(apartment_id)));

-- -------------------------------------------------------------
-- Índices útiles
-- -------------------------------------------------------------
create index if not exists idx_gm_user        on public.group_members(user_id);
create index if not exists idx_buildings_group on public.buildings(group_id);
create index if not exists idx_apts_building   on public.apartments(building_id);
create index if not exists idx_tenants_apt     on public.tenants(apartment_id);
create index if not exists idx_payments_apt    on public.payments(apartment_id);
create index if not exists idx_expenses_bld    on public.expenses(building_id);
create index if not exists idx_invites_email   on public.group_invites(lower(email));

-- =============================================================
-- FIN del esquema (Fase 1)
-- =============================================================
