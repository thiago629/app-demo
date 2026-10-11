-- Tertu: esquema de base de datos (Supabase / PostgreSQL, región UE)
--
-- Separación de datos:
--   public   -> lo que el usuario publica y decide mostrar (perfil público, posts, grupos)
--   privado  -> datos personales (email, teléfono, fecha de nacimiento, IP de alta,
--               consentimientos, solicitudes RGPD). Nunca expuesto por la API pública;
--               solo el propio usuario lee lo suyo y el personal autorizado vía service role.
--   auditoria-> registro inmutable de accesos y cambios sobre datos personales.

create extension if not exists pg_trgm;

-- ===================================================================
-- DATOS PERSONALES (esquema separado)
-- ===================================================================
create schema if not exists privado;
revoke all on schema privado from anon, authenticated;
grant usage on schema privado to authenticated;

create table privado.datos_personales (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  email          text not null,
  telefono       text,
  fecha_nacimiento date not null,
  pais           text not null default 'ES',
  ip_registro    inet,
  creado         timestamptz not null default now(),
  actualizado    timestamptz not null default now(),
  borrado_programado timestamptz,   -- fecha en que se borrará todo (máx. 30 días tras pedirlo)
  -- Edad mínima 16 (decisión del hilo legal; RGPD art. 8 / LOPDGDD art. 7)
  constraint edad_minima check (fecha_nacimiento <= (current_date - interval '16 years'))
);

-- Cada consentimiento queda registrado con la versión exacta del documento aceptado
create table privado.consentimientos (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  tipo          text not null check (tipo in ('terminos','privacidad','cookies','marketing','personalizacion')),
  version_doc   text not null,
  aceptado      boolean not null,
  fecha         timestamptz not null default now(),
  ip            inet,
  user_agent    text
);

-- Solicitudes de derechos RGPD (acceso, rectificación, supresión, portabilidad, oposición, limitación)
create table privado.solicitudes_rgpd (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete set null,
  tipo          text not null check (tipo in ('acceso','rectificacion','supresion','portabilidad','oposicion','limitacion')),
  estado        text not null default 'recibida' check (estado in ('recibida','en_proceso','resuelta','denegada')),
  detalle       text,
  recibida      timestamptz not null default now(),
  limite        timestamptz not null default now() + interval '1 month', -- plazo legal RGPD art. 12.3
  resuelta      timestamptz
);

alter table privado.datos_personales enable row level security;
alter table privado.consentimientos  enable row level security;
alter table privado.solicitudes_rgpd enable row level security;

create policy "leo mis datos" on privado.datos_personales for select using (auth.uid() = user_id);
create policy "edito mis datos" on privado.datos_personales for update using (auth.uid() = user_id);
create policy "leo mis consentimientos" on privado.consentimientos for select using (auth.uid() = user_id);
create policy "doy consentimiento" on privado.consentimientos for insert with check (auth.uid() = user_id);
create policy "leo mis solicitudes" on privado.solicitudes_rgpd for select using (auth.uid() = user_id);
create policy "pido mis derechos" on privado.solicitudes_rgpd for insert with check (auth.uid() = user_id);
grant select, insert, update on all tables in schema privado to authenticated;

-- ===================================================================
-- AUDITORÍA (registro de actividad sobre datos personales, RGPD art. 30/32)
-- ===================================================================
create schema if not exists auditoria;
revoke all on schema auditoria from anon, authenticated;

create table auditoria.registro (
  id         bigint generated always as identity primary key,
  tabla      text not null,
  operacion  text not null,
  user_id    uuid,
  actor      uuid default auth.uid(),
  fecha      timestamptz not null default now()
);

create or replace function auditoria.anotar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into auditoria.registro(tabla, operacion, user_id)
  values (tg_table_schema || '.' || tg_table_name, tg_op, coalesce(new.user_id, old.user_id));
  return coalesce(new, old);
end $$;

create trigger aud_datos after insert or update or delete on privado.datos_personales
  for each row execute function auditoria.anotar();
create trigger aud_consent after insert or update or delete on privado.consentimientos
  for each row execute function auditoria.anotar();
create trigger aud_solic after insert or update or delete on privado.solicitudes_rgpd
  for each row execute function auditoria.anotar();

-- ===================================================================
-- DOCUMENTOS LEGALES (los textos los redacta el hilo legal; la app los muestra)
-- ===================================================================
create table public.documentos_legales (
  slug        text not null check (slug in ('terminos','privacidad','cookies','normas','aviso-legal','dsa')),
  version     text not null,
  titulo      text not null,
  contenido   text not null,          -- Markdown
  vigente_desde timestamptz not null default now(),
  primary key (slug, version)
);
alter table public.documentos_legales enable row level security;
create policy "todos leen lo legal" on public.documentos_legales for select using (true);

-- ===================================================================
-- RED SOCIAL (datos públicos)
-- ===================================================================
create table public.perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  usuario     text unique not null check (usuario ~ '^[a-zA-Z0-9_]{3,20}$'),
  nombre      text not null check (char_length(nombre) between 1 and 50),
  bio         text check (char_length(bio) <= 160),
  avatar_url  text,
  privado     boolean not null default false,     -- cuenta protegida
  verificado  boolean not null default false,
  creado      timestamptz not null default now()
);

create table public.grupos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null check (char_length(nombre) between 3 and 60),
  descripcion text check (char_length(descripcion) <= 300),
  privado     boolean not null default false,
  creador     uuid not null references public.perfiles(id) on delete cascade,
  creado      timestamptz not null default now()
);

create table public.miembros_grupo (
  grupo_id uuid references public.grupos(id) on delete cascade,
  user_id  uuid references public.perfiles(id) on delete cascade,
  rol      text not null default 'miembro' check (rol in ('admin','moderador','miembro')),
  unido    timestamptz not null default now(),
  primary key (grupo_id, user_id)
);

create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  autor       uuid not null references public.perfiles(id) on delete cascade,
  texto       text check (char_length(texto) <= 500),
  tipo        text not null default 'texto' check (tipo in ('texto','foto','video','meme')),
  respuesta_a uuid references public.posts(id) on delete set null,
  cita_de     uuid references public.posts(id) on delete set null,
  grupo_id    uuid references public.grupos(id) on delete cascade,
  oculto      boolean not null default false,       -- retirado por moderación (DSA)
  creado      timestamptz not null default now()
);
create index on public.posts (creado desc);
create index on public.posts (autor, creado desc);
create index posts_texto_trgm on public.posts using gin (texto gin_trgm_ops);

create table public.medios (
  id       uuid primary key default gen_random_uuid(),
  post_id  uuid not null references public.posts(id) on delete cascade,
  ruta     text not null,                   -- ruta en Storage, bucket "medios"
  tipo     text not null check (tipo in ('imagen','video','gif')),
  alt      text check (char_length(alt) <= 1000), -- texto alternativo (accesibilidad)
  meme_arriba text check (char_length(meme_arriba) <= 80),
  meme_abajo  text check (char_length(meme_abajo) <= 80),
  orden    smallint not null default 0
);

create table public.hashtags (
  etiqueta text primary key check (etiqueta ~ '^[[:alnum:]_]{1,50}$')
);
create table public.post_hashtags (
  post_id  uuid references public.posts(id) on delete cascade,
  etiqueta text references public.hashtags(etiqueta) on delete cascade,
  primary key (post_id, etiqueta)
);
create table public.menciones (
  post_id  uuid references public.posts(id) on delete cascade,
  user_id  uuid references public.perfiles(id) on delete cascade,
  primary key (post_id, user_id)
);

create table public.seguidores (
  seguidor uuid references public.perfiles(id) on delete cascade,
  seguido  uuid references public.perfiles(id) on delete cascade,
  creado   timestamptz not null default now(),
  primary key (seguidor, seguido),
  check (seguidor <> seguido)
);
create table public.me_gusta (
  user_id uuid references public.perfiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  creado  timestamptz not null default now(),
  primary key (user_id, post_id)
);
create table public.compartidos (
  user_id uuid references public.perfiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  creado  timestamptz not null default now(),
  primary key (user_id, post_id)
);
create table public.silenciados (
  user_id    uuid references public.perfiles(id) on delete cascade,
  silenciado uuid references public.perfiles(id) on delete cascade,
  primary key (user_id, silenciado)
);
create table public.bloqueos (
  user_id   uuid references public.perfiles(id) on delete cascade,
  bloqueado uuid references public.perfiles(id) on delete cascade,
  primary key (user_id, bloqueado)
);

-- Denuncias (Ley de Servicios Digitales, art. 16: mecanismo de notificación y acción)
create table public.denuncias (
  id          bigint generated always as identity primary key,
  denunciante uuid references public.perfiles(id) on delete set null,
  post_id     uuid references public.posts(id) on delete cascade,
  perfil_id   uuid references public.perfiles(id) on delete cascade,
  grupo_id    uuid references public.grupos(id) on delete cascade,
  motivo      text not null check (motivo in ('odio','acoso','violencia','sexual','menores','spam','falso','derechos_autor','otro')),
  detalle     text,
  estado      text not null default 'pendiente' check (estado in ('pendiente','revisada','retirado','desestimada')),
  decision_motivada text,    -- DSA art. 17: explicación al afectado
  creado      timestamptz not null default now()
);

-- Recurso contra decisiones de moderación (DSA art. 20)
create table public.apelaciones (
  id          bigint generated always as identity primary key,
  denuncia_id bigint not null references public.denuncias(id) on delete cascade,
  user_id     uuid not null references public.perfiles(id) on delete cascade,
  motivo      text not null check (char_length(motivo) between 10 and 2000),
  estado      text not null default 'pendiente' check (estado in ('pendiente','aceptada','rechazada')),
  creado      timestamptz not null default now()
);

create table public.notificaciones (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references public.perfiles(id) on delete cascade,
  tipo      text not null check (tipo in ('me_gusta','respuesta','mencion','seguidor','compartido','grupo','moderacion')),
  actor     uuid references public.perfiles(id) on delete cascade,
  post_id   uuid references public.posts(id) on delete cascade,
  leida     boolean not null default false,
  creado    timestamptz not null default now()
);

-- RLS de la parte pública -------------------------------------------
alter table public.perfiles        enable row level security;
alter table public.grupos          enable row level security;
alter table public.miembros_grupo  enable row level security;
alter table public.posts           enable row level security;
alter table public.medios          enable row level security;
alter table public.hashtags        enable row level security;
alter table public.post_hashtags   enable row level security;
alter table public.menciones       enable row level security;
alter table public.seguidores      enable row level security;
alter table public.me_gusta        enable row level security;
alter table public.compartidos     enable row level security;
alter table public.bloqueos        enable row level security;
alter table public.silenciados     enable row level security;
alter table public.apelaciones     enable row level security;
alter table public.denuncias       enable row level security;
alter table public.notificaciones  enable row level security;

create or replace function public.es_miembro(g uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.miembros_grupo m where m.grupo_id = g and m.user_id = auth.uid())
$$;

create policy "perfiles visibles" on public.perfiles for select using (true);
create policy "edito mi perfil" on public.perfiles for update using (auth.uid() = id);
create policy "creo mi perfil" on public.perfiles for insert with check (auth.uid() = id);

create policy "grupos visibles" on public.grupos for select using (not privado or public.es_miembro(id));
create policy "creo grupos" on public.grupos for insert with check (auth.uid() = creador);
create policy "admin edita grupo" on public.grupos for update using (auth.uid() = creador);

create policy "miembros visibles" on public.miembros_grupo for select using (true);
create policy "me uno a grupo publico" on public.miembros_grupo for insert
  with check (auth.uid() = user_id and exists (select 1 from public.grupos g where g.id = grupo_id and (not g.privado or g.creador = auth.uid())));
create policy "salgo del grupo" on public.miembros_grupo for delete using (auth.uid() = user_id);

create policy "posts visibles" on public.posts for select using (
  not oculto
  and (grupo_id is null or public.es_miembro(grupo_id) or exists (select 1 from public.grupos g where g.id = grupo_id and not g.privado))
  and not exists (select 1 from public.bloqueos b where b.user_id = autor and b.bloqueado = auth.uid())
);
create policy "publico" on public.posts for insert with check (
  auth.uid() = autor and (grupo_id is null or public.es_miembro(grupo_id))
);
create policy "borro mis posts" on public.posts for delete using (auth.uid() = autor);

create policy "medios visibles" on public.medios for select using (true);
create policy "subo medios" on public.medios for insert with check (exists (select 1 from public.posts p where p.id = post_id and p.autor = auth.uid()));
create policy "hashtags visibles" on public.hashtags for select using (true);
create policy "creo hashtags" on public.hashtags for insert with check (auth.uid() is not null);
create policy "ph visibles" on public.post_hashtags for select using (true);
create policy "ph creo" on public.post_hashtags for insert with check (exists (select 1 from public.posts p where p.id = post_id and p.autor = auth.uid()));
create policy "menciones visibles" on public.menciones for select using (true);
create policy "menciono" on public.menciones for insert with check (exists (select 1 from public.posts p where p.id = post_id and p.autor = auth.uid()));

create policy "seguidores visibles" on public.seguidores for select using (true);
create policy "sigo" on public.seguidores for insert with check (auth.uid() = seguidor);
create policy "dejo de seguir" on public.seguidores for delete using (auth.uid() = seguidor);
create policy "likes visibles" on public.me_gusta for select using (true);
create policy "doy like" on public.me_gusta for insert with check (auth.uid() = user_id);
create policy "quito like" on public.me_gusta for delete using (auth.uid() = user_id);
create policy "rt visibles" on public.compartidos for select using (true);
create policy "comparto" on public.compartidos for insert with check (auth.uid() = user_id);
create policy "descomparto" on public.compartidos for delete using (auth.uid() = user_id);
create policy "mis bloqueos" on public.bloqueos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mis silenciados" on public.silenciados for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apelo" on public.apelaciones for insert with check (auth.uid() = user_id);
create policy "veo mis apelaciones" on public.apelaciones for select using (auth.uid() = user_id);
create policy "denuncio" on public.denuncias for insert with check (auth.uid() = denunciante);
create policy "veo mis denuncias" on public.denuncias for select using (auth.uid() = denunciante);
create policy "mis notificaciones" on public.notificaciones for select using (auth.uid() = user_id);
create policy "marco leidas" on public.notificaciones for update using (auth.uid() = user_id);

-- Almacenamiento de fotos/vídeos/memes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('medios', 'medios', true, 104857600,
        array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime'])
on conflict (id) do nothing;
create policy "subo a mi carpeta" on storage.objects for insert
  with check (bucket_id = 'medios' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "borro lo mio" on storage.objects for delete
  using (bucket_id = 'medios' and (storage.foldername(name))[1] = auth.uid()::text);

-- ===================================================================
-- DERECHOS RGPD ejecutables por el propio usuario
-- ===================================================================
-- Exportar todos mis datos (portabilidad, art. 20) en JSON
create or replace function public.exportar_mis_datos() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'exportado', now(),
    'perfil', (select to_jsonb(p) from public.perfiles p where p.id = auth.uid()),
    'datos_personales', (select to_jsonb(d) from privado.datos_personales d where d.user_id = auth.uid()),
    'consentimientos', (select coalesce(jsonb_agg(c), '[]') from privado.consentimientos c where c.user_id = auth.uid()),
    'posts', (select coalesce(jsonb_agg(x), '[]') from public.posts x where x.autor = auth.uid()),
    'siguiendo', (select coalesce(jsonb_agg(s.seguido), '[]') from public.seguidores s where s.seguidor = auth.uid()),
    'grupos', (select coalesce(jsonb_agg(m.grupo_id), '[]') from public.miembros_grupo m where m.user_id = auth.uid())
  )
$$;

-- Borrar mi cuenta (supresión, art. 17). El contenido se oculta al momento y
-- todo se borra en cascada en un máximo de 30 días (tarea programada abajo).
create or replace function public.borrar_mi_cuenta() returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into privado.solicitudes_rgpd(user_id, tipo, estado) values (auth.uid(), 'supresion', 'en_proceso');
  update privado.datos_personales set borrado_programado = now() + interval '30 days' where user_id = auth.uid();
  update public.posts set oculto = true where autor = auth.uid();
end $$;

create or replace function privado.purgar_cuentas() returns void
language plpgsql security definer set search_path = '' as $$
begin
  update privado.solicitudes_rgpd s set estado = 'resuelta', resuelta = now()
   where s.tipo = 'supresion' and s.estado = 'en_proceso'
     and s.user_id in (select user_id from privado.datos_personales where borrado_programado <= now());
  delete from auth.users where id in (select user_id from privado.datos_personales where borrado_programado <= now());
end $$;
-- Activar en Supabase (extensión pg_cron):
-- select cron.schedule('purgar-cuentas', '0 3 * * *', 'select privado.purgar_cuentas()');

-- Cuentas de 16 y 17 años: privadas por defecto (protección de menores, DSA art. 28)
create or replace function privado.menor_privado() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.fecha_nacimiento > (current_date - interval '18 years') then
    update public.perfiles set privado = true where id = new.user_id;
  end if;
  return new;
end $$;
create trigger perfil_menor after insert on privado.datos_personales
  for each row execute function privado.menor_privado();

grant execute on function public.exportar_mis_datos() to authenticated;
grant execute on function public.borrar_mi_cuenta() to authenticated;
