// Troceo de texto en partes normales, #temas, @menciones y enlaces
export type Trozo =
  | { tipo: 'texto'; valor: string }
  | { tipo: 'hashtag'; valor: string }
  | { tipo: 'mencion'; valor: string }
  | { tipo: 'enlace'; valor: string };

const RE = /(#[\p{L}\p{N}_]{1,50})|(@[A-Za-z0-9_]{3,20})|(https?:\/\/[^\s]+)/gu;

export function trocear(texto: string): Trozo[] {
  const out: Trozo[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > ultimo) out.push({ tipo: 'texto', valor: texto.slice(ultimo, i) });
    if (m[1]) out.push({ tipo: 'hashtag', valor: m[1].slice(1) });
    else if (m[2]) out.push({ tipo: 'mencion', valor: m[2].slice(1) });
    else out.push({ tipo: 'enlace', valor: m[3] });
    ultimo = i + m[0].length;
  }
  if (ultimo < texto.length) out.push({ tipo: 'texto', valor: texto.slice(ultimo) });
  return out;
}

export const hashtagsDe = (t: string) =>
  [...new Set(trocear(t).filter((x) => x.tipo === 'hashtag').map((x) => x.valor.toLowerCase()))];

export const mencionesDe = (t: string) =>
  [...new Set(trocear(t).filter((x) => x.tipo === 'mencion').map((x) => x.valor.toLowerCase()))];

export function hace(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function edad(fechaNacimiento: string): number {
  const n = new Date(fechaNacimiento);
  const hoy = new Date();
  let e = hoy.getFullYear() - n.getFullYear();
  const mes = hoy.getMonth() - n.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < n.getDate())) e--;
  return e;
}
