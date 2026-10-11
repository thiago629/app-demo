# Prompts para crear la app en Rocket y Stitch

Copia cada bloque tal cual. Primero Stitch (diseño de pantallas) y luego Rocket (la app que funciona).
La app se llama DEMO (app de prueba para que Francisco la vea). Cuando elijáis el nombre definitivo, cambia DEMO por ese nombre.

## 1. Stitch (stitch.withgoogle.com): diseño de las pantallas

```
Diseña una app móvil de red social tipo X/Twitter llamada DEMO.
Estilo: minimalista y premium, negro #0B0B0D, blanco #FAFAFA y plata #C3C7CE. Tipografía Inter. Modo claro y oscuro.
Pantallas:
1. Bienvenida con logo, la etiqueta "DEMO · APP DE PRUEBA", "Crear cuenta" y "Ya tengo cuenta".
2. Registro: nombre, @usuario, email, contraseña, fecha de nacimiento (mínimo 16 años) y casillas para aceptar términos y privacidad (sin marcar).
3. Inicio con dos pestañas: "Para ti" y "Siguiendo" (orden cronológico). Botón flotante para publicar.
4. Tarjeta de publicación: avatar, nombre, @usuario, hora, texto con #hashtags y @menciones resaltados, foto/vídeo/meme, botones responder, compartir, me gusta, guardar y menú con denunciar, bloquear y silenciar.
5. Publicar: texto (500 caracteres), añadir foto, vídeo o meme (texto arriba y abajo).
6. Explorar: buscador y tendencias (#).
7. Grupos: lista, crear grupo (público o privado) y pantalla de grupo.
8. Notificaciones.
9. Perfil: foto, biografía, seguidores, seguidos, pestañas Publicaciones, Respuestas y Me gusta.
10. Ajustes: privacidad de la cuenta, descargar mis datos, borrar mi cuenta, documentos legales y botón "Archivo de privacidad".
12. Archivo de privacidad (solo administrador): registro de tratamientos (qué datos, para qué, base legal, cuánto se guardan) y lista de personas registradas con el email oculto (l•••@correo.com), edad y consentimientos.
11. Banner de cookies con "Aceptar" y "Rechazar" del mismo tamaño.
Barra inferior: Inicio, Explorar, Grupos, Notificaciones, Perfil.
```

## 2. Rocket (rocket.new): la app que funciona

```
Crea una app móvil (iOS, Android y web) de red social tipo X/Twitter llamada DEMO, en español.
Usa el diseño de Stitch que te adjunto (o, si no, estilo minimalista negro #0B0B0D, blanco #FAFAFA y plata #C3C7CE, modo claro y oscuro).
Base de datos: Supabase en una región de la UE (Frankfurt o Irlanda).

Funciones:
- Cuentas con email y contraseña. Edad mínima 16 años: pedir fecha de nacimiento y bloquear el registro si es menor. Las cuentas de 16 y 17 años son privadas por defecto.
- Perfil: nombre, @usuario único, foto, biografía, cuenta pública o privada, seguir y dejar de seguir.
- Publicar texto (máx. 500 caracteres), fotos, vídeos (máx. 3 min) y memes (imagen con texto arriba y abajo). Borrar la ubicación (EXIF) de las fotos al subirlas.
- #hashtags y @menciones clicables; una página por hashtag; tendencias en Explorar; notificación al mencionado.
- Responder, me gusta, compartir y guardar.
- Feed "Para ti" y feed "Siguiendo" en orden cronológico sin algoritmo.
- Grupos públicos y privados con miembros y publicaciones propias.
- Notificaciones.
- Seguridad: denunciar publicación, perfil o grupo con motivo; bloquear; silenciar; recurrir una decisión de moderación. Panel de moderación para administradores.
- Privacidad: descargar mis datos (JSON), borrar mi cuenta (se oculta al momento y se borra a los 30 días) también desde una página web pública /eliminar-cuenta, banner de cookies con Aceptar y Rechazar iguales, guardar cada consentimiento con fecha y versión.
- Páginas legales: política de privacidad, términos, normas de la comunidad, aviso legal y cookies (te pego los textos).

Archivo de datos privados: crea una pantalla de administrador "Archivo de privacidad" con el registro de tratamientos y la lista de usuarios con el email oculto, edad y consentimientos; solo la ve el rol administrador.
Datos personales separados: email, fecha de nacimiento y consentimientos en una tabla privada con reglas RLS para que solo los vea su dueño; un registro de auditoría de accesos. Activa RLS en todas las tablas.
```

Después de crearla, pega en Rocket los textos de la carpeta legal (01 a 05) para las páginas legales.

## 3. Opcional: las 3 funciones exclusivas

Pégalo en Rocket después, solo si queréis que la app las tenga.

```
Añade una pestaña "Arena" con dos secciones:
- El Ring: un usuario reta a otro (o deja un reto abierto) a debatir un tema. Cada uno tiene 3 intervenciones por turnos (máx. 500 caracteres). Después, el resto vota durante 24 horas quién ganó; los participantes no votan. Ranking de victorias.
- Duelo de memes: cada semana hay un tema y un hashtag. Los memes con ese hashtag se enfrentan por parejas y la gente elige cuál gana. Clasificación y campeón de la semana anterior.
Y en publicar, la Cápsula del tiempo: un botón con un reloj para elegir una fecha futura. La publicación queda sellada (nadie la lee ni se puede editar) hasta esa fecha. Al abrirse, la gente vota "¿Acertó?" sí o no, y el autor gana la insignia Visionario si acierta.
```
