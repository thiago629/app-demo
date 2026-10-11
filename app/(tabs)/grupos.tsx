import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { useEstado } from '../../src/lib/store';
import { Boton, Cabecera, Icono } from '../../src/components/ui';

export default function Grupos() {
  const t = useTheme();
  const yo = useEstado((e) => e.sesion);
  const grupos = useEstado((e) => e.grupos);
  const miembros = useEstado((e) => e.miembros);
  const mios = new Set(miembros.filter((m) => m.userId === yo).map((m) => m.grupoId));
  const fila = (g: (typeof grupos)[number]) => (
    <Pressable key={g.id} onPress={() => router.push(`/grupo/${g.id}`)} style={{ padding: 16, borderBottomWidth: 1, borderColor: t.line, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ color: t.text, fontSize: 16, fontWeight: '700' }}>{g.nombre}</Text>
        {g.privado && <Icono n="candado" size={14} color={t.muted} />}
      </View>
      <Text style={{ color: t.muted }}>{g.descripcion}</Text>
      <Text style={{ color: t.muted, fontSize: 12 }}>{miembros.filter((m) => m.grupoId === g.id).length} miembros</Text>
    </Pressable>
  );
  const visiblesG = grupos.filter((g) => !g.privado || mios.has(g.id));
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Grupos" derecha={<Boton titulo="Crear" onPress={() => router.push('/grupo/nuevo')} estilo={{ paddingVertical: 8 }} />} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={{ color: t.muted, fontWeight: '700', padding: 16, paddingBottom: 4 }}>MIS GRUPOS</Text>
        {visiblesG.filter((g) => mios.has(g.id)).map(fila)}
        {!visiblesG.some((g) => mios.has(g.id)) && <Text style={{ color: t.muted, paddingHorizontal: 16 }}>Todavía no estás en ningún grupo.</Text>}
        <Text style={{ color: t.muted, fontWeight: '700', padding: 16, paddingBottom: 4 }}>DESCUBRIR</Text>
        {visiblesG.filter((g) => !mios.has(g.id)).map(fila)}
      </ScrollView>
    </View>
  );
}
