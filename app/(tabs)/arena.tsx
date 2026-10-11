// Arena: las funciones exclusivas de competición (El Ring y el Duelo de memes)
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import {
  clasificacionDuelo, estadoDebate, ganadorDebate, rankingRing, siguienteCombate, turnoDe, useEstado, votarDuelo,
} from '../../src/lib/store';
import type { Debate } from '../../src/lib/types';
import { Avatar, Boton, Cabecera, Icono, Pestañas } from '../../src/components/ui';
import { MedioVista } from '../../src/components/Post';

const ETIQUETA = { abierto: 'Reto abierto', en_curso: 'En juego', votacion: 'Votación abierta', cerrado: 'Terminado' };

export function FilaDebate({ d }: { d: Debate }) {
  const t = useTheme();
  const perfiles = useEstado((e) => e.perfiles);
  const yo = useEstado((e) => e.sesion);
  const est = estadoDebate(d);
  const a = perfiles[d.retador];
  const b = d.rival ? perfiles[d.rival] : undefined;
  const g = ganadorDebate(d);
  const miTurno = turnoDe(d) === yo;
  return (
    <Pressable onPress={() => router.push(`/ring/${d.id}`)} style={{ padding: 16, gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: t.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: est === 'votacion' || miTurno ? t.accent : t.chip, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text style={{ color: est === 'votacion' || miTurno ? t.accentText : t.muted, fontSize: 12, fontWeight: '700' }}>{miTurno ? 'Te toca' : ETIQUETA[est]}</Text>
        </View>
        <Text style={{ color: t.muted, fontSize: 12 }}>{d.turnos.length}/6 intervenciones · {d.votos.length} votos</Text>
      </View>
      <Text style={{ color: t.text, fontSize: 17, fontWeight: '800' }}>{d.tema}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {a && <Avatar nombre={a.nombre} color={a.avatarColor} size={26} />}
        <Text style={{ color: t.text, fontWeight: g === d.retador ? '800' : '500' }}>@{a?.usuario}{g === d.retador ? ' 🏆' : ''}</Text>
        <Text style={{ color: t.muted, fontWeight: '800' }}>VS</Text>
        {b ? <><Avatar nombre={b.nombre} color={b.avatarColor} size={26} /><Text style={{ color: t.text, fontWeight: g === d.rival ? '800' : '500' }}>@{b.usuario}{g === d.rival ? ' 🏆' : ''}</Text></>
          : <Text style={{ color: t.accent, fontWeight: '700' }}>¿Quién se atreve?</Text>}
      </View>
    </Pressable>
  );
}

function Ring() {
  const t = useTheme();
  const debates = useEstado((e) => e.debates);
  const e = useEstado((x) => x);
  const ranking = useMemo(() => rankingRing(e), [e]);
  const orden = { votacion: 0, en_curso: 1, abierto: 2, cerrado: 3 };
  const lista = [...debates].sort((a, b) => orden[estadoDebate(a)] - orden[estadoDebate(b)]);
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={{ padding: 16, gap: 10 }}>
        <Text style={{ color: t.text, fontSize: 15 }}>Reta a alguien a un debate: 3 intervenciones cada uno y la gente vota quién gana durante 24 horas.</Text>
        <Boton titulo="Retar a alguien" onPress={() => router.push('/ring/nuevo')} />
      </View>
      {ranking.length > 0 && (
        <View style={{ marginHorizontal: 16, padding: 14, borderRadius: 16, backgroundColor: t.chip, gap: 6 }}>
          <Text style={{ color: t.muted, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }}>CAMPEONES DEL RING</Text>
          {ranking.slice(0, 5).map((r, i) => (
            <Text key={r.userId} style={{ color: t.text }}>{i + 1}. @{e.perfiles[r.userId]?.usuario} · {r.victorias} {r.victorias === 1 ? 'victoria' : 'victorias'}</Text>
          ))}
        </View>
      )}
      {lista.map((d) => <FilaDebate key={d.id} d={d} />)}
    </ScrollView>
  );
}

function DueloMemes() {
  const t = useTheme();
  const e = useEstado((x) => x);
  const combate = siguienteCombate(e);
  const tabla = clasificacionDuelo(e);
  const dias = Math.max(0, Math.ceil((Date.parse(e.duelo.fin) - Date.now()) / 864e5));
  const campeon = e.duelo.campeonAnterior ? e.perfiles[e.duelo.campeonAnterior.userId] : undefined;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: t.muted, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }}>TEMA DE LA SEMANA · QUEDAN {dias} DÍAS</Text>
        <Text style={{ color: t.text, fontSize: 26, fontWeight: '900' }}>{e.duelo.tema}</Text>
        <Text style={{ color: t.muted }}>Sube tu meme con #{e.duelo.hashtag}. Los memes se enfrentan por parejas y el que más combates gane se lleva la corona.</Text>
        {campeon && <Text style={{ color: t.text, marginTop: 4 }}>👑 Campeón anterior ({e.duelo.campeonAnterior!.tema}): <Text style={{ fontWeight: '800' }}>@{campeon.usuario}</Text></Text>}
      </View>
      <Boton titulo="Participar con mi meme" onPress={() => router.push({ pathname: '/publicar', params: { duelo: e.duelo.hashtag } })} />
      <Text style={{ color: t.text, fontSize: 18, fontWeight: '800' }}>¿Cuál es mejor?</Text>
      {combate ? (
        <View style={{ gap: 12 }}>
          {combate.map((p, i) => {
            const otro = combate[1 - i];
            return (
              <View key={p.id} style={{ gap: 8 }}>
                <Text style={{ color: t.muted, fontSize: 13 }}>@{e.perfiles[p.autor]?.usuario}</Text>
                {p.medios[0] && <MedioVista m={p.medios[0]} />}
                <Boton titulo="Este gana" onPress={() => votarDuelo(p.id, otro.id)} />
                {i === 0 && <Text style={{ color: t.muted, textAlign: 'center', fontWeight: '900', fontSize: 18 }}>VS</Text>}
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: t.muted }}>Has votado todos los combates. Vuelve cuando haya memes nuevos.</Text>
      )}
      <Text style={{ color: t.text, fontSize: 18, fontWeight: '800' }}>Clasificación</Text>
      {tabla.map((r, i) => (
        <Pressable key={r.post.id} onPress={() => router.push(`/post/${r.post.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ color: t.text, fontWeight: '900', width: 26, fontVariant: ['tabular-nums'] }}>{i + 1}.</Text>
          <Text style={{ color: t.text, flex: 1 }} numberOfLines={1}>@{e.perfiles[r.post.autor]?.usuario} · “{r.post.medios[0]?.memeArriba?.toLowerCase()}”</Text>
          <Text style={{ color: t.muted, fontVariant: ['tabular-nums'] }}>{r.victorias} de {r.combates}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function Arena() {
  const [vista, setVista] = useState<'ring' | 'duelo'>('ring');
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Arena" izquierda={<Icono n="trofeo" />} />
      <Pestañas opciones={[{ v: 'ring', t: 'El Ring' }, { v: 'duelo', t: 'Duelo de memes' }]} valor={vista} onCambio={setVista} />
      {vista === 'ring' ? <Ring /> : <DueloMemes />}
    </View>
  );
}
