// Estado de la app en modo demostración (todo en el dispositivo).
// En producción cada acción llama a Supabase (ver supabase/migrations y README):
// las tablas tienen los mismos nombres y la misma separación público / privado.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import type {
  Debate, Duelo, Consentimiento, DatosPersonales, Denuncia, Grupo, Medio, MotivoDenuncia, Notificacion, Perfil, Post,
} from './types';
import { edad, mencionesDe } from './texto';
import { semilla } from './semilla';
import { VERSION_LEGAL } from './legal';
import marca from './marca.json';

export type Estado = {
  perfiles: Record<string, Perfil>;
  posts: Post[];
  grupos: Grupo[];
  miembros: { grupoId: string; userId: string; rol: 'admin' | 'miembro' }[];
  seguidores: { seguidor: string; seguido: string }[];
  likes: { userId: string; postId: string }[];
  compartidos: { userId: string; postId: string; creado: string }[];
  guardados: { userId: string; postId: string }[];
  bloqueos: { userId: string; bloqueado: string }[];
  silenciados: { userId: string; silenciado: string }[];
  notificaciones: Record<string, Notificacion[]>;
  denuncias: Denuncia[];
  apelaciones: { id: string; denunciaId: string; userId: string; motivo: string; creado: string }[];
  sesion: string | null;
  // Esquema "privado": nunca se muestra en ninguna pantalla pública
  privado: {
    datos: Record<string, DatosPersonales>;
    consentimientos: Record<string, Consentimiento[]>;
  };
  cookies: { decidido: boolean; analitica: boolean };
  debates: Debate[];
  duelo: Duelo;
  capsulaVotos: { postId: string; userId: string; acierto: boolean }[];
};

const CLAVE = 'demo.app.v3';
let estado: Estado = semilla();
const oyentes = new Set<() => void>();

function cambiar(f: (e: Estado) => Estado) {
  estado = f(estado);
  oyentes.forEach((o) => o());
  AsyncStorage.setItem(CLAVE, JSON.stringify(estado)).catch(() => {});
}

export async function cargar() {
  try {
    const raw = await AsyncStorage.getItem(CLAVE);
    if (raw) {
      estado = JSON.parse(raw);
      oyentes.forEach((o) => o());
    }
  } catch {}
}

export function useEstado<T>(sel: (e: Estado) => T): T {
  return useSyncExternalStore(
    (o) => { oyentes.add(o); return () => oyentes.delete(o); },
    () => sel(estado),
    () => sel(estado),
  );
}
export const leer = () => estado;

const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const ahora = () => new Date().toISOString();

function notificar(e: Estado, para: string, n: Omit<Notificacion, 'id' | 'leida' | 'creado'>): Estado {
  if (para === n.actor) return e;
  const lista = e.notificaciones[para] ?? [];
  return { ...e, notificaciones: { ...e.notificaciones, [para]: [{ ...n, id: id(), leida: false, creado: ahora() }, ...lista] } };
}

// ---------------------------------------------------------------- Cuenta
export const EDAD_MINIMA = 16;

export type Registro = {
  email: string; usuario: string; nombre: string; fechaNacimiento: string;
  aceptaTerminos: boolean; aceptaPrivacidad: boolean;
};

export function registrar(r: Registro): string | null {
  const usuario = r.usuario.trim().replace(/^@/, '');
  if (!/^[A-Za-z0-9_]{3,20}$/.test(usuario)) return 'El usuario debe tener de 3 a 20 letras, números o _.';
  if (Object.values(estado.perfiles).some((p) => p.usuario.toLowerCase() === usuario.toLowerCase()))
    return 'Ese nombre de usuario ya existe.';
  if (!/^\S+@\S+\.\S+$/.test(r.email)) return 'Escribe un email válido.';
  if (!r.nombre.trim()) return 'Escribe tu nombre.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.fechaNacimiento) || isNaN(Date.parse(r.fechaNacimiento)))
    return 'Escribe tu fecha de nacimiento como AAAA-MM-DD.';
  const años = edad(r.fechaNacimiento);
  if (años < EDAD_MINIMA) return `${marca.nombre} es para mayores de ${EDAD_MINIMA} años.`;
  if (!r.aceptaTerminos || !r.aceptaPrivacidad) return 'Tienes que aceptar los términos y la política de privacidad.';

  const uid = id();
  const menor = años < 18;
  cambiar((e) => ({
    ...e,
    sesion: uid,
    perfiles: {
      ...e.perfiles,
      [uid]: { id: uid, usuario, nombre: r.nombre.trim(), bio: '', avatarColor: '#8A9099', privado: menor, creado: ahora() },
    },
    privado: {
      datos: { ...e.privado.datos, [uid]: { userId: uid, email: r.email.trim().toLowerCase(), fechaNacimiento: r.fechaNacimiento, pais: 'ES' } },
      consentimientos: {
        ...e.privado.consentimientos,
        [uid]: [
          { tipo: 'terminos', versionDoc: VERSION_LEGAL, aceptado: true, fecha: ahora() },
          { tipo: 'privacidad', versionDoc: VERSION_LEGAL, aceptado: true, fecha: ahora() },
        ],
      },
    },
    // Al empezar sigue a la cuenta oficial para no ver el inicio vacío
    seguidores: [...e.seguidores, { seguidor: uid, seguido: 'u_oficial' }],
  }));
  return null;
}

export function entrar(emailOUsuario: string): string | null {
  const q = emailOUsuario.trim().toLowerCase().replace(/^@/, '');
  const porEmail = Object.values(estado.privado.datos).find((d) => d.email === q);
  const porUsuario = Object.values(estado.perfiles).find((p) => p.usuario.toLowerCase() === q);
  const uid = porEmail?.userId ?? porUsuario?.id;
  if (!uid) return 'No encontramos esa cuenta.';
  if (estado.privado.datos[uid]?.borradoProgramado) return 'Esta cuenta está en proceso de borrado.';
  cambiar((e) => ({ ...e, sesion: uid }));
  return null;
}

export const salir = () => cambiar((e) => ({ ...e, sesion: null }));

export function actualizarPerfil(c: Partial<Pick<Perfil, 'nombre' | 'bio' | 'privado' | 'avatarColor'>>) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, perfiles: { ...e.perfiles, [yo]: { ...e.perfiles[yo], ...c } } }));
}

export function decidirCookies(analitica: boolean) {
  cambiar((e) => {
    const yo = e.sesion;
    const c = { ...e, cookies: { decidido: true, analitica } };
    if (!yo) return c;
    const lista = e.privado.consentimientos[yo] ?? [];
    return {
      ...c,
      privado: {
        ...e.privado,
        consentimientos: { ...e.privado.consentimientos, [yo]: [...lista, { tipo: 'analitica', versionDoc: VERSION_LEGAL, aceptado: analitica, fecha: ahora() }] },
      },
    };
  });
}

// Portabilidad (RGPD art. 20): todo lo del usuario en JSON
export function exportarMisDatos(): string {
  const yo = estado.sesion!;
  return JSON.stringify({
    exportado: ahora(),
    perfil: estado.perfiles[yo],
    datos_personales: estado.privado.datos[yo],
    consentimientos: estado.privado.consentimientos[yo] ?? [],
    posts: estado.posts.filter((p) => p.autor === yo),
    me_gusta: estado.likes.filter((l) => l.userId === yo).map((l) => l.postId),
    siguiendo: estado.seguidores.filter((s) => s.seguidor === yo).map((s) => estado.perfiles[s.seguido]?.usuario),
    grupos: estado.miembros.filter((m) => m.userId === yo).map((m) => estado.grupos.find((g) => g.id === m.grupoId)?.nombre),
    denuncias_enviadas: estado.denuncias.filter((d) => d.denunciante === yo),
  }, null, 2);
}

// Supresión (RGPD art. 17): se oculta todo al momento y se borra en 30 días
export function borrarMiCuenta() {
  const yo = estado.sesion; if (!yo) return;
  const fecha = new Date(Date.now() + 30 * 864e5).toISOString();
  cambiar((e) => ({
    ...e,
    sesion: null,
    posts: e.posts.map((p) => (p.autor === yo ? { ...p, oculto: true } : p)),
    privado: { ...e.privado, datos: { ...e.privado.datos, [yo]: { ...e.privado.datos[yo], borradoProgramado: fecha } } },
  }));
}

// ---------------------------------------------------------------- Publicar
export function publicar(p: { texto: string; tipo: Post['tipo']; medios: Medio[]; respuestaA?: string; grupoId?: string; abreEl?: string }) {
  const yo = estado.sesion; if (!yo) return;
  const post: Post = { id: id(), autor: yo, texto: p.texto.trim(), tipo: p.tipo, medios: p.medios, respuestaA: p.respuestaA, grupoId: p.grupoId, abreEl: p.abreEl, creado: ahora() };
  cambiar((e) => {
    let n: Estado = { ...e, posts: [post, ...e.posts] };
    for (const u of mencionesDe(post.texto)) {
      const dest = Object.values(e.perfiles).find((x) => x.usuario.toLowerCase() === u);
      if (dest) n = notificar(n, dest.id, { tipo: 'mencion', actor: yo, postId: post.id });
    }
    if (p.respuestaA) {
      const orig = e.posts.find((x) => x.id === p.respuestaA);
      if (orig) n = notificar(n, orig.autor, { tipo: 'respuesta', actor: yo, postId: post.id });
    }
    return n;
  });
  return post.id;
}

export function borrarPost(postId: string) {
  cambiar((e) => ({ ...e, posts: e.posts.filter((p) => !(p.id === postId && p.autor === e.sesion)) }));
}

function alternar<T>(lista: T[], igual: (x: T) => boolean, nuevo: T): [T[], boolean] {
  return lista.some(igual) ? [lista.filter((x) => !igual(x)), false] : [[...lista, nuevo], true];
}

export function meGusta(postId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => {
    const [likes, puesto] = alternar(e.likes, (l) => l.userId === yo && l.postId === postId, { userId: yo, postId });
    const autor = e.posts.find((p) => p.id === postId)?.autor;
    const n = { ...e, likes };
    return puesto && autor ? notificar(n, autor, { tipo: 'me_gusta', actor: yo, postId }) : n;
  });
}

export function compartir(postId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => {
    const [compartidos, puesto] = alternar(e.compartidos, (l) => l.userId === yo && l.postId === postId, { userId: yo, postId, creado: ahora() });
    const autor = e.posts.find((p) => p.id === postId)?.autor;
    const n = { ...e, compartidos };
    return puesto && autor ? notificar(n, autor, { tipo: 'compartido', actor: yo, postId }) : n;
  });
}

export function guardar(postId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, guardados: alternar(e.guardados, (g) => g.userId === yo && g.postId === postId, { userId: yo, postId })[0] }));
}

// ---------------------------------------------------------------- Personas
export function seguir(userId: string) {
  const yo = estado.sesion; if (!yo || yo === userId) return;
  cambiar((e) => {
    const [seguidores, puesto] = alternar(e.seguidores, (s) => s.seguidor === yo && s.seguido === userId, { seguidor: yo, seguido: userId });
    const n = { ...e, seguidores };
    return puesto ? notificar(n, userId, { tipo: 'seguidor', actor: yo }) : n;
  });
}

export function bloquear(userId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({
    ...e,
    bloqueos: alternar(e.bloqueos, (b) => b.userId === yo && b.bloqueado === userId, { userId: yo, bloqueado: userId })[0],
    seguidores: e.seguidores.filter((s) => !((s.seguidor === yo && s.seguido === userId) || (s.seguidor === userId && s.seguido === yo))),
  }));
}

export function silenciar(userId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, silenciados: alternar(e.silenciados, (b) => b.userId === yo && b.silenciado === userId, { userId: yo, silenciado: userId })[0] }));
}

// ---------------------------------------------------------------- Moderación (DSA)
export function denunciar(objetivo: Denuncia['objetivo'], motivo: MotivoDenuncia, detalle?: string) {
  const yo = estado.sesion; if (!yo) return;
  const d: Denuncia = { id: id(), denunciante: yo, objetivo, motivo, detalle, estado: 'pendiente', creado: ahora() };
  cambiar((e) => notificar({ ...e, denuncias: [d, ...e.denuncias] }, yo, {
    tipo: 'moderacion',
    texto: 'Hemos recibido tu denuncia. Te avisaremos cuando la revisemos.',
    denunciaId: d.id,
  }));
}

export function apelar(denunciaId: string, motivo: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => notificar({ ...e, apelaciones: [...e.apelaciones, { id: id(), denunciaId, userId: yo, motivo, creado: ahora() }] }, yo, {
    tipo: 'moderacion',
    texto: 'Hemos recibido tu recurso. Una persona del equipo lo revisará.',
  }));
}

export function marcarLeidas() {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, notificaciones: { ...e.notificaciones, [yo]: (e.notificaciones[yo] ?? []).map((n) => ({ ...n, leida: true })) } }));
}

// ---------------------------------------------------------------- Grupos
export function crearGrupo(nombre: string, descripcion: string, privado: boolean): string | null {
  const yo = estado.sesion; if (!yo) return null;
  if (nombre.trim().length < 3) return null;
  const g: Grupo = { id: id(), nombre: nombre.trim(), descripcion: descripcion.trim(), privado, creador: yo, creado: ahora() };
  cambiar((e) => ({ ...e, grupos: [g, ...e.grupos], miembros: [...e.miembros, { grupoId: g.id, userId: yo, rol: 'admin' }] }));
  return g.id;
}

export function unirseGrupo(grupoId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({
    ...e,
    miembros: alternar(e.miembros, (m) => m.grupoId === grupoId && m.userId === yo, { grupoId, userId: yo, rol: 'miembro' as const })[0],
  }));
}

// ---------------------------------------------------------------- Lecturas
export function visibles(e: Estado): Post[] {
  const yo = e.sesion;
  const fuera = new Set([
    ...e.bloqueos.filter((b) => b.userId === yo).map((b) => b.bloqueado),
    ...e.bloqueos.filter((b) => b.bloqueado === yo).map((b) => b.userId),
    ...e.silenciados.filter((s) => s.userId === yo).map((s) => s.silenciado),
  ]);
  const misGrupos = new Set(e.miembros.filter((m) => m.userId === yo).map((m) => m.grupoId));
  return e.posts.filter((p) => {
    if (p.oculto || fuera.has(p.autor)) return false;
    if (p.grupoId) {
      const g = e.grupos.find((x) => x.id === p.grupoId);
      if (g?.privado && !misGrupos.has(g.id)) return false;
    }
    return true;
  });
}

// "Siguiendo": cronológico puro (requisito DSA art. 38, feed sin perfilado)
export function feedSiguiendo(e: Estado): Post[] {
  const sigo = new Set(e.seguidores.filter((s) => s.seguidor === e.sesion).map((s) => s.seguido));
  sigo.add(e.sesion ?? '');
  return visibles(e)
    .filter((p) => sigo.has(p.autor) && !p.respuestaA && !p.grupoId)
    .sort((a, b) => b.creado.localeCompare(a.creado));
}

// "Para ti": puntuación sencilla y explicable (interacción + frescura)
export function feedParaTi(e: Estado): Post[] {
  const puntos = (p: Post) => {
    const likes = e.likes.filter((l) => l.postId === p.id).length;
    const rts = e.compartidos.filter((l) => l.postId === p.id).length * 2;
    const resp = e.posts.filter((x) => x.respuestaA === p.id).length * 1.5;
    const horas = (Date.now() - Date.parse(p.creado)) / 36e5;
    return (1 + likes + rts + resp) / Math.pow(horas + 2, 1.2);
  };
  return visibles(e).filter((p) => !p.respuestaA && !p.grupoId).sort((a, b) => puntos(b) - puntos(a));
}

export function tendencias(e: Estado): { tag: string; n: number }[] {
  const cuenta = new Map<string, number>();
  for (const p of visibles(e).filter(capsulaAbierta)) for (const m of p.texto.matchAll(/#([\p{L}\p{N}_]{1,50})/gu)) {
    const t = m[1].toLowerCase(); cuenta.set(t, (cuenta.get(t) ?? 0) + 1);
  }
  return [...cuenta.entries()].map(([tag, n]) => ({ tag, n })).sort((a, b) => b.n - a.n).slice(0, 10);
}

// ================================================================ EL RING
export const TURNOS_RING = 6; // 3 intervenciones por persona
const HORAS_VOTACION = 24;

export function estadoDebate(d: Debate): 'abierto' | 'en_curso' | 'votacion' | 'cerrado' {
  if (!d.rival) return 'abierto';
  if (d.turnos.length < TURNOS_RING) return 'en_curso';
  return d.finVotacion && Date.parse(d.finVotacion) <= Date.now() ? 'cerrado' : 'votacion';
}

export function turnoDe(d: Debate): string | null {
  if (!d.rival || d.turnos.length >= TURNOS_RING) return null;
  return d.turnos.length % 2 === 0 ? d.retador : d.rival;
}

export function ganadorDebate(d: Debate): string | null {
  if (estadoDebate(d) !== 'cerrado' || !d.rival) return null;
  const a = d.votos.filter((v) => v.por === d.retador).length;
  const b = d.votos.filter((v) => v.por === d.rival).length;
  return a === b ? null : a > b ? d.retador : d.rival;
}

export function crearDebate(tema: string, rivalUsuario: string): string | null {
  const yo = estado.sesion; if (!yo || tema.trim().length < 5) return null;
  const u = rivalUsuario.trim().replace(/^@/, '').toLowerCase();
  const rival = u ? Object.values(estado.perfiles).find((p) => p.usuario.toLowerCase() === u)?.id ?? null : null;
  if (u && (!rival || rival === yo)) return null;
  const d: Debate = { id: id(), tema: tema.trim(), retador: yo, rival, turnos: [], votos: [], creado: ahora() };
  cambiar((e) => {
    const n = { ...e, debates: [d, ...e.debates] };
    return rival ? notificar(n, rival, { tipo: 'ring', actor: yo, debateId: d.id }) : n;
  });
  return d.id;
}

export function aceptarReto(debateId: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => {
    const d = e.debates.find((x) => x.id === debateId);
    if (!d || d.rival || d.retador === yo) return e;
    return notificar({ ...e, debates: e.debates.map((x) => (x.id === debateId ? { ...x, rival: yo } : x)) }, d.retador, { tipo: 'ring', actor: yo, debateId });
  });
}

export function intervenir(debateId: string, texto: string) {
  const yo = estado.sesion; if (!yo || !texto.trim()) return;
  cambiar((e) => {
    const d = e.debates.find((x) => x.id === debateId);
    if (!d || turnoDe(d) !== yo) return e;
    const turnos = [...d.turnos, { autor: yo, texto: texto.trim().slice(0, 500), creado: ahora() }];
    const fin = turnos.length >= TURNOS_RING ? new Date(Date.now() + HORAS_VOTACION * 36e5).toISOString() : undefined;
    const otro = yo === d.retador ? d.rival! : d.retador;
    return notificar({ ...e, debates: e.debates.map((x) => (x.id === debateId ? { ...x, turnos, finVotacion: fin } : x)) }, otro, { tipo: 'ring', actor: yo, debateId });
  });
}

export function votarDebate(debateId: string, por: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({
    ...e,
    debates: e.debates.map((d) => {
      if (d.id !== debateId || estadoDebate(d) !== 'votacion' || yo === d.retador || yo === d.rival) return d;
      return { ...d, votos: [...d.votos.filter((v) => v.userId !== yo), { userId: yo, por }] };
    }),
  }));
}

export function rankingRing(e: Estado): { userId: string; victorias: number }[] {
  const c = new Map<string, number>();
  for (const d of e.debates) { const g = ganadorDebate(d); if (g) c.set(g, (c.get(g) ?? 0) + 1); }
  return [...c.entries()].map(([userId, victorias]) => ({ userId, victorias })).sort((a, b) => b.victorias - a.victorias);
}

// ================================================================ DUELO DE MEMES
export function participantesDuelo(e: Estado): Post[] {
  const tag = '#' + e.duelo.hashtag.toLowerCase();
  return visibles(e).filter((p) => p.tipo === 'meme' && p.texto.toLowerCase().includes(tag));
}

export function siguienteCombate(e: Estado): [Post, Post] | null {
  const lista = participantesDuelo(e);
  const yo = e.sesion;
  const vistos = new Set(e.duelo.votos.filter((v) => v.userId === yo).map((v) => [v.ganador, v.perdedor].sort().join('|')));
  for (let i = 0; i < lista.length; i++)
    for (let j = i + 1; j < lista.length; j++)
      if (!vistos.has([lista[i].id, lista[j].id].sort().join('|'))) return [lista[i], lista[j]];
  return null;
}

export function votarDuelo(ganador: string, perdedor: string) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, duelo: { ...e.duelo, votos: [...e.duelo.votos, { userId: yo, ganador, perdedor }] } }));
}

export function clasificacionDuelo(e: Estado): { post: Post; victorias: number; combates: number }[] {
  return participantesDuelo(e).map((post) => ({
    post,
    victorias: e.duelo.votos.filter((v) => v.ganador === post.id).length,
    combates: e.duelo.votos.filter((v) => v.ganador === post.id || v.perdedor === post.id).length,
  })).sort((a, b) => b.victorias - a.victorias || a.combates - b.combates);
}

// ================================================================ CÁPSULA DEL TIEMPO
export const capsulaAbierta = (p: Post) => !p.abreEl || Date.parse(p.abreEl) <= Date.now();

export function votarCapsula(postId: string, acierto: boolean) {
  const yo = estado.sesion; if (!yo) return;
  cambiar((e) => ({ ...e, capsulaVotos: [...e.capsulaVotos.filter((v) => !(v.postId === postId && v.userId === yo)), { postId, userId: yo, acierto }] }));
}

// Puntos de "visionario": cápsulas abiertas en las que la mayoría dice que acertó
export function puntosVisionario(e: Estado, userId: string): number {
  return e.posts.filter((p) => p.autor === userId && p.abreEl && capsulaAbierta(p)).filter((p) => {
    const v = e.capsulaVotos.filter((x) => x.postId === p.id);
    return v.length > 0 && v.filter((x) => x.acierto).length > v.length / 2;
  }).length;
}
