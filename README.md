# DEMO · app de Stitch

Web estática con las pantallas de la app DEMO diseñadas en Google Stitch.

- `/` es el feed de inicio; `/pantallas` lista todas las pantallas.
- Cada pantalla está en su carpeta (`/perfil`, `/mensajes`, `/predicciones`…).
- `tw.js` es Tailwind (play build 3.4.10) servido desde la propia web.
- `docs/` guarda las guías y prompts exportados de Stitch.

## Publicar en Vercel

1. vercel.com/new → importar este repo.
2. Framework: **Other**. Sin comando de build. Directorio de salida: la raíz.
3. Deploy.

La versión anterior (app Expo) sigue en el historial de git y en el repo `demon-aplicasion`.
