"""Empaqueta la build web (dist/) en un único HTML autocontenido para publicarlo como Artifact."""
import base64, glob, json, mimetypes, os, re, sys

dist, salida = sys.argv[1], sys.argv[2]
marca = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'marca.json')))
js_path = glob.glob(os.path.join(dist, '_expo/static/js/web/*.js'))[0]
js = open(js_path, encoding='utf-8').read()

def data_uri(ruta):
    mime = mimetypes.guess_type(ruta)[0] or 'application/octet-stream'
    return f"data:{mime};base64," + base64.b64encode(open(ruta, 'rb').read()).decode()

# Las imágenes se referencian como "/assets/...": se incrustan como data URI
for m in set(re.findall(r'"(/assets/[^"]+)"', js)):
    ruta = os.path.join(dist, m.lstrip('/'))
    if os.path.exists(ruta):
        js = js.replace(f'"{m}"', json.dumps(data_uri(ruta)))
js = js.replace('</script', '<\\/script')

html = f"""<title>{marca['nombre']} demo</title>
<style>
:root {{ --bg: #FAFAFA; color-scheme: light }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #0B0B0D; color-scheme: dark }} }}
:root[data-theme="dark"] {{ --bg: #0B0B0D; color-scheme: dark }}
html, body {{ height: 100%; }}
body {{ background: var(--bg); overflow: hidden; }}
#root {{ display: flex; height: 100%; flex: 1; }}
</style>
<div id="root"></div>
<script>
// La app usa rutas propias (/u/..., /tag/...): arrancamos siempre en la raíz
try {{ history.replaceState(null, '', '/'); }} catch (e) {{}}
</script>
<script>{js}</script>
"""
open(salida, 'w', encoding='utf-8').write(html)
print('ok', round(len(html) / 1e6, 2), 'MB')
