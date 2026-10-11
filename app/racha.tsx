import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/lib/theme';
import { hoyISO, racha, useEstado } from '../src/lib/store';
import { Boton, Cabecera, Icono } from '../src/components/ui';
import { RachiImagen } from '../src/components/Rachi';

const MENSAJE = {
  fuego: (n: number) => ({ titulo: `¡${n} ${n === 1 ? 'día' : 'días'} en llamas!`, texto: 'Hoy ya has participado. Vuelve mañana para que Rachi siga ardiendo.' }),
  normal: (n: number) => ({ titulo: n ? `Racha de ${n} ${n === 1 ? 'día' : 'días'}` : 'Empieza tu racha', texto: n ? 'Rachi espera: publica o comenta hoy para encenderlo.' : 'Publica o comenta hoy y Rachi se encenderá. Cada día seguido suma.' }),
  hielo: (n: number) => ({ titulo: `Tu racha de ${n} días está congelada`, texto: 'Ayer no participaste. Publica o comenta hoy para descongelar a Rachi y salvar la racha. Si hoy tampoco participas, se pierde.' }),
};

export default function Racha() {
  const t = useTheme();
  const e = useEstado((x) => x);
  if (!e.sesion) return null;
  const r = racha(e, e.sesion);
  const m = MENSAJE[r.modo](r.dias);
  const dias = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d; });
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Tu racha" izquierda={<Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}><Icono n="atras" /></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18, alignItems: 'center', paddingBottom: 80 }}>
        <RachiImagen modo={r.modo} size={200} />
        <Text style={{ color: t.text, fontSize: 26, fontWeight: '900', textAlign: 'center' }}>{m.titulo}</Text>
        <Text style={{ color: t.muted, fontSize: 16, textAlign: 'center' }}>{m.texto}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          {dias.map((d) => {
            const iso = hoyISO(d), activo = r.activos.has(iso), hoy = iso === hoyISO();
            return (
              <View key={iso} style={{ alignItems: 'center', gap: 4, width: 36 }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: activo ? '#FF8A1F' : t.chip, borderWidth: hoy ? 2 : 0, borderColor: t.text }}>
                  <Text style={{ color: activo ? '#fff' : t.muted, fontWeight: '800', fontSize: 12 }}>{d.getDate()}</Text>
                </View>
                <Text style={{ color: t.muted, fontSize: 10 }}>{['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()]}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ color: t.text }}>Mejor racha: <Text style={{ fontWeight: '800' }}>{r.mejor} días</Text></Text>
        {r.modo !== 'fuego' && <Boton titulo="Publicar ahora" onPress={() => router.push('/publicar')} estilo={{ alignSelf: 'stretch' }} />}
        <Text style={{ color: t.muted, fontSize: 12, textAlign: 'center' }}>Cuenta publicar y comentar. Si fallas un día, Rachi se congela y tienes hasta el final del día siguiente para salvarlo.</Text>
      </ScrollView>
    </View>
  );
}
