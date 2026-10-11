# Especificación Técnica y Arquitectura de DEMO para Claude Code / Vercel

Guía paso a paso para desplegar la red social **DEMO** en **Vercel** usando Next.js 14+ (App Router), Tailwind CSS y Supabase.

---

## 1. Stack Tecnológico Recomendado

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Estilos**: Tailwind CSS con paleta temática *Kinetic Obsidian* (Dark Mode)
- **Base de Datos & Auth**: Supabase (PostgreSQL en región UE con Row Level Security)
- **Despliegue & Hosting**: Vercel (Edge Functions / Serverless)
- **Iconografía**: Lucide React / Heroicons

---

## 2. Paleta de Colores y Tokens (Kinetic Obsidian)

Configuración recomendada para `tailwind.config.ts`:

```typescript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0c0d17',
        surface: {
          DEFAULT: '#12131d',
          dim: '#0c0d17',
          bright: '#1a1b25',
          card: '#161722',
          border: '#232433'
        },
        primary: {
          DEFAULT: '#8b5cf6', // Violeta Neón
          foreground: '#ffffff',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
        },
        accent: {
          cyan: '#06b6d4',
          fire: '#ff6b35',
          ice: '#38bdf8',
          success: '#10b981',
          warning: '#f59e0b'
        }
      }
    }
  }
}
```

---

## 3. Mapa de Rutas (Estructura App Router en Next.js)

```
app/
├── (auth)/
│   ├── bienvenida/page.tsx       # Splash y bienvenida inicial
│   └── registro/page.tsx         # Registro con par de claves cifradas
├── (main)/
│   ├── layout.tsx                # Shell principal (Top bar + Bottom Nav móvil)
│   ├── page.tsx                  # Feed de inicio (Inicio Feed)
│   ├── explorar/page.tsx         # Tendencias, búsqueda y categorías
│   ├── publicar/page.tsx         # Compositor de posts + Creador de memes
│   ├── notificaciones/page.tsx   # Avisos y menciones
│   ├── perfil/page.tsx           # Perfil de usuario e insignias
│   ├── post/[id]/page.tsx        # Detalle de publicación y respuestas
│   └── grupos/page.tsx           # Comunidades descentralizadas
├── (chat)/
│   ├── mensajes/page.tsx         # Bandeja de chats con contadores de racha
│   └── chat/[id]/page.tsx        # Chat privado/grupal con Rachi y envío de racha
├── predicciones/
│   └── page.tsx                  # Predicciones con puntos (1.000 base + 50 diarios)
├── ai-assistant/
│   └── page.tsx                  # Asistente DEMO AI (Reglamento UE)
├── tienda/
│   └── page.tsx                  # Mercado de stickers y memes (85% para creadores)
├── ajustes/
│   ├── page.tsx                  # Ajustes generales
│   ├── idioma/page.tsx           # Selector global multilingüe (12+ idiomas)
│   ├── ciberseguridad/page.tsx   # Centro de seguridad, alertas de intrusión
│   ├── boveda/page.tsx           # Bóveda P2P de mensajes cifrados
│   └── sesiones/page.tsx         # Dispositivos conectados y Kill Switch
└── pro/
    ├── page.tsx                  # Suscripción DEMO Black PRO
    └── ads/page.tsx              # Administrador de anuncios y promociones
```

---

## 4. Esquema de Base de Datos Supabase (SQL con RLS y Región UE)

```sql
-- 1. Perfiles de usuario
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  is_verified boolean default false,
  is_pro boolean default false,
  prediction_points integer default 1000 check (prediction_points >= 0),
  daily_points_claimed_at date,
  created_at timestamptz default now()
);

-- 2. Publicaciones
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  media_url text,
  likes_count integer default 0,
  replies_count integer default 0,
  reposts_count integer default 0,
  created_at timestamptz default now()
);

-- 3. Rachas y Mascota Rachi
create table public.streaks (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid not null,
  days_count integer default 1,
  status text default 'normal' check (status in ('normal', 'fire', 'ice')),
  last_activity_date date default current_date,
  highest_streak integer default 1,
  created_at timestamptz default now()
);

-- 4. Predicciones con Puntos (Cumplimiento Ley 13/2011)
create table public.predictions (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.profiles(id) not null,
  question text not null,
  category text not null, -- Fútbol, Realities, Noticias, etc.
  options jsonb not null, -- [{id: 1, text: "Opción A", points: 0, percent: 0}]
  total_pot integer default 0,
  closes_at timestamptz not null,
  is_resolved boolean default false,
  winning_option_id integer,
  official_source_url text,
  legal_notice text default 'Los puntos no tienen valor económico: no se compran, no se venden y no se canjean por dinero ni bienes (Ley 13/2011).',
  created_at timestamptz default now()
);

-- 5. Apuestas de Puntos (50, 100, 250)
create table public.bets (
  id uuid default gen_random_uuid() primary key,
  prediction_id uuid references public.predictions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  option_id integer not null,
  points integer not null check (points in (50, 100, 250)),
  created_at timestamptz default now(),
  unique(prediction_id, user_id) -- 1 apuesta por persona inmodificable
);

-- Habilitar Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.streaks enable row level security;
alter table public.predictions enable row level security;
alter table public.bets enable row level security;
```

---

## 5. Instrucciones para Claude Code

Pega este prompt directamente en **Claude Code**:

```markdown
Hola Claude Code, quiero que implementes la app web móvil "DEMO", una red social moderna tipo X con gamificación, estética cyberpunk/dark neón (Kinetic Obsidian: fondo #0c0d17, tarjetas #12131d, acento violeta #8b5cf6 y cian #06b6d4) para desplegarla en Vercel.

Requisitos clave de la implementación:
1. Framework: Next.js 14 App Router con Tailwind CSS y Lucide Icons.
2. Formato: Mobile-first adaptativo con navegación inferior persistente (Inicio, Explorar, Publicar, Grupos, Perfil).
3. Pantallas prioritarias:
   - Feed principal con publicaciones multimedia y buscador.
   - Bandeja de chats con contadores de racha y estado de Rachi (Normal, Fuego, Hielo).
   - Módulo de Predicciones con puntos (1.000 pts de bienvenida, apuestas de 50/100/250 pts, bote proporcional y aviso legal de la Ley 13/2011).
   - Asistente DEMO AI con respuestas en español y sello de cumplimiento del Reglamento UE.
   - Selector de idiomas multilingüe y tienda de stickers con reparto del 85% a creadores.
4. Conexión Supabase: Configura la autenticación y el cliente Supabase con RLS.
5. Preparación para Vercel: Asegúrate de que `npm run build` pase sin errores de TypeScript ni ESLint y genera el archivo `vercel.json` si es necesario.
```

---

## 6. Pasos para Desplegar en Vercel

1. **Subir a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit DEMO app"
   git remote add origin https://github.com/TU_USUARIO/demo-app.git
   git push -u origin main
   ```
2. **Importar en Vercel**:
   - Entra en [vercel.com](https://vercel.com) e inicia sesión.
   - Haz clic en **Add New... > Project** e importa el repositorio `demo-app`.
3. **Variables de Entorno**:
   Configura en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL del proyecto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima pública de Supabase
4. **Deploy**:
   - Haz clic en **Deploy**. En 1–2 minutos tu aplicación estará en vivo con dominio `.vercel.app`.
