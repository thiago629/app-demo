# Prompts: racha en el chat (con Rachi) y Predicciones con puntos

Pégalos en Rocket (o Lovable, Bolt, Rork…) después del prompt principal de la app. Las imágenes de Rachi están en la carpeta racha (rachi-normal.png, rachi-fuego.png, rachi-hielo.png).

## 1. Racha en el chat, entre dos personas y en grupos

```
Añade mensajes privados y chats de grupo con una "racha compartida" y la mascota Rachi.

Chat:
- Lista de conversaciones (privadas y de grupo) con foto, nombre, último mensaje y, a la derecha, Rachi pequeño con el número de días de racha de esa conversación.
- Dentro del chat: mensajes de texto, fotos, vídeos, memes y notas de voz. Indicador "escribiendo…" con tres puntitos animados.
- En la barra de escribir, a la izquierda, un botón de tres puntitos (⋯). Al tocarlo se abre un menú con: "Enviar a Rachi 🔥", "Foto", "Vídeo", "Meme", "Encuesta".

Enviar a Rachi:
- "Enviar a Rachi" manda al chat una tarjeta animada con Rachi y el texto "¡Mantén la racha!". Cuenta como interacción del día.
- Racha entre dos personas: sube 1 día cuando LAS DOS personas envían al menos un mensaje o un Rachi ese mismo día.
- Racha de grupo: sube 1 día cuando al menos la mitad de los miembros (mínimo 3) participa ese día. Mostrar "Hoy faltan 2 personas para mantener la racha" con sus avatares.
- Estados de Rachi en cada chat: plateado (hoy aún no se ha cumplido), en llamas (hoy ya se ha cumplido) y congelado dentro de un cubo de hielo (ayer no se cumplió; si hoy se cumple, se descongela; si no, la racha vuelve a 0).
- Cuando faltan 4 horas para que se pierda, enviar una notificación: "Rachi se está congelando con @usuario. ¡Escríbele!". Se puede desactivar en Ajustes.
- Hitos con animación especial a los 7, 30, 100 y 365 días (Rachi con corona). Mostrar la racha más larga en el perfil, solo si el usuario quiere.

Privacidad y menores:
- Solo se puede escribir por privado a quien te sigue o te ha escrito antes; los menores de 18 solo reciben mensajes de quien siguen.
- Bloquear, silenciar y denunciar desde el menú del chat. Las rachas nunca se muestran públicamente sin permiso.

Base de datos (Supabase, región UE, RLS activado): tablas conversaciones, miembros_conversacion, mensajes, rachas (conversacion_id, dias, ultimo_dia_cumplido, mejor_racha) y actividad_diaria (conversacion_id, user_id, dia). Solo los miembros de una conversación pueden leer sus mensajes.
```

## 2. Predicciones con puntos

```
Añade una sección "Predicciones" donde la gente apuesta PUNTOS, sin dinero real, sobre lo que va a pasar.

Funcionamiento:
- Cada usuario empieza con 1.000 puntos y recibe 50 puntos gratis cada día que entra (sin poder acumular más de 1.000 por regalos).
- Una predicción tiene: pregunta, categoría (Fútbol y deportes, Realities y TV, Noticias, Música, Otros), de 2 a 4 opciones, fecha y hora de cierre, y quién la creó.
- Para apostar: elegir 50, 100 o 250 puntos y tocar una opción. Una apuesta por persona y predicción; no se puede cambiar.
- Cada opción muestra el porcentaje de puntos apostados con una barra de progreso.
- Al cerrar, el creador (o un moderador) marca el resultado con una fuente (enlace a la noticia o al resultado oficial). Los que acertaron se reparten todo el bote en proporción a lo que apostaron.
- Notificación al resolverse: "¡Acertaste! Ganas 320 puntos" o "Esta vez no. Te quedan 680 puntos".

Rankings:
- Ranking semanal, mensual y de siempre por puntos ganados, y el porcentaje de aciertos de cada usuario.
- Ranking entre amigos (solo gente que sigues) y ranking dentro de cada grupo.
- Insignias: "Vidente" (5 aciertos seguidos), "Experto en fútbol", "Experto en realities", "Experto en noticias".

Reglas legales (obligatorias):
- Mostrar siempre: "Los puntos no tienen valor económico: no se compran, no se venden y no se canjean por nada." Así no es un juego de azar con dinero (Ley 13/2011 de regulación del juego).
- Prohibido vender puntos o dar premios con valor económico por ellos.
- Las predicciones siguen las normas de la comunidad: nada sobre muertes, tragedias, delitos o personas menores. Botón de denunciar en cada predicción.

Base de datos (Supabase, región UE, RLS): tablas predicciones, opciones_prediccion, apuestas (user_id, prediccion_id, opcion_id, puntos) y movimientos_puntos (historial de cada suma o resta).
```
