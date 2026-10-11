import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { aceptarReto, estadoDebate, ganadorDebate, intervenir, TURNOS_RING, turnoDe, useEstado, votarDebate } from '../../src/lib/store';
import { hace } from '../../src/lib/texto';
import { Avatar, Boton, Cabecera, Icono, Vacio } from '../../src/components/ui';

export default function RingDetalle() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = useEstado((e) => e.debates.find((x) => x.id === id));
  const perfiles = useEstado((e) => e.perfiles);
  const yo = useEstado((e) => e.sesion);
  const [texto, setTexto] = useState('');
  const atras = <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/arena'))}><Icono n="atras" /></Pressable>;
  if (!d) return <View style={{ flex: 1 }}><Cabecera titulo="El Ring" izquierda={atras} /><Vacio texto="Este debate no existe." /></View>;

  const est = estadoDebate(d);
  const a = perfiles[d.retador];
  const b = d.rival ? perfiles[d.rival] : undefined;
  const toca = turnoDe(d);
  const soyLuchador = yo === d.retador || yo === d.rival;
  const miVoto = d.votos.find((v) => v.userId === yo)?.por;
  const total = d.votos.length || 1;
  const pct = (uid?: string) => Math.round((d.votos.filter((v) => v.por === uid).length / total) * 100);
  const g = ganadorDebate(d);
  const horas = d.finVotacion ? Math.max(0, Math.ceil((Date.parse(d.finVotacion) - Date.now()) / 36e5)) : 0;

  const Esquina = ({ uid }: { uid?: string }) => {
    const p = uid ? perfiles[uid] : undefined;
    return (
      <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
        {p ? <Avatar nombre={p.nombre} color={p.avatarColor} size={56} /> : <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderStyle: 'dashed', borderColor: t.muted }} />}
        <Text style={{ color: t.text, fontWeight: '800' }} numberOfLines={1}>{p ? `@${p.usuario}` : 'Libre'}{g && g === uid ? ' 🏆' : ''}</Text>
        {(est === 'votacion' || est === 'cerrado') && uid && <Text style={{ color: t.muted, fontVariant: ['tabular-nums'] }}>{pct(uid)} %</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Cabecera titulo="El Ring" izquierda={atras} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 140 }}>
        <Text style={{ color: t.text, fontSize: 22, fontWeight: '900', textAlign: 'center' }}>{d.tema}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Esquina uid={d.retador} />
          <Text style={{ color: t.accent, fontSize: 22, fontWeight: '900' }}>VS</Text>
          <Esquina uid={d.rival ?? undefined} />
        </View>
        {(est === 'votacion' || est === 'cerrado') && (
          <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: t.chip }}>
            <View style={{ flex: Math.max(pct(d.retador), 1), backgroundColor: t.text }} />
            <View style={{ flex: Math.max(pct(d.rival ?? ''), 1), backgroundColor: t.accent }} />
          </View>
        )}
        <Text style={{ color: t.muted, textAlign: 'center' }}>
          {est === 'abierto' && 'Reto abierto: el primero que lo acepte se sube al Ring.'}
          {est === 'en_curso' && `Intervención ${d.turnos.length + 1} de ${TURNOS_RING}. Turno de @${perfiles[toca ?? '']?.usuario}.`}
          {est === 'votacion' && `Votación abierta: quedan ${horas} h. ${d.votos.length} votos.`}
          {est === 'cerrado' && (g ? `Ganó @${perfiles[g]?.usuario} con ${pct(g)} % de ${d.votos.length} votos.` : `Empate a ${d.votos.length / 2} votos.`)}
        </Text>

        {d.turnos.map((x, i) => {
          const izq = x.autor === d.retador;
          const p = perfiles[x.autor];
          return (
            <View key={i} style={{ alignSelf: izq ? 'flex-start' : 'flex-end', maxWidth: '85%', gap: 4 }}>
              <Text style={{ color: t.muted, fontSize: 12, textAlign: izq ? 'left' : 'right' }}>Ronda {Math.floor(i / 2) + 1} · @{p?.usuario} · {hace(x.creado)}</Text>
              <View style={{ backgroundColor: izq ? t.chip : t.accent, borderRadius: 16, padding: 12 }}>
                <Text style={{ color: izq ? t.text : t.accentText, fontSize: 16, lineHeight: 22 }}>{x.texto}</Text>
              </View>
            </View>
          );
        })}

        {est === 'abierto' && yo !== d.retador && <Boton titulo="Aceptar el reto" onPress={() => aceptarReto(d.id)} />}
        {est === 'votacion' && !soyLuchador && (
          <View style={{ gap: 8 }}>
            <Text style={{ color: t.text, fontWeight: '800', textAlign: 'center' }}>{miVoto ? 'Has votado. Puedes cambiar tu voto hasta que cierre.' : '¿Quién lo ha argumentado mejor?'}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Boton titulo={`@${a?.usuario}`} tipo={miVoto === d.retador ? 'primario' : 'secundario'} estilo={{ flex: 1 }} onPress={() => votarDebate(d.id, d.retador)} />
              <Boton titulo={`@${b?.usuario}`} tipo={miVoto === d.rival ? 'primario' : 'secundario'} estilo={{ flex: 1 }} onPress={() => votarDebate(d.id, d.rival!)} />
            </View>
          </View>
        )}
      </ScrollView>
      {toca === yo && (
        <View style={{ flexDirection: 'row', gap: 10, padding: 12, borderTopWidth: 1, borderColor: t.line, alignItems: 'flex-end' }}>
          <TextInput value={texto} onChangeText={setTexto} multiline maxLength={500} placeholder="Tu argumento (máx. 500)" placeholderTextColor={t.muted}
            style={{ flex: 1, color: t.text, fontSize: 16, maxHeight: 140, borderWidth: 1, borderColor: t.line, borderRadius: 16, padding: 10 }} />
          <Boton titulo="Enviar" desactivado={!texto.trim()} onPress={() => { intervenir(d.id, texto); setTexto(''); }} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
