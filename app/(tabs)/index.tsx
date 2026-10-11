import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { feedParaTi, feedSiguiendo, useEstado } from '../../src/lib/store';
import { Cabecera, Icono, Pestañas, Simbolo } from '../../src/components/ui';
import { BotonPublicar, ListaPosts } from '../../src/components/Lista';
import marca from '../../src/lib/marca.json';

export default function Inicio() {
  const [modo, setModo] = useState<'parati' | 'siguiendo'>('parati');
  const posts = useEstado((e) => e.posts);
  const e = useEstado((x) => x);
  const lista = useMemo(() => (modo === 'parati' ? feedParaTi(e) : feedSiguiendo(e)), [modo, e, posts]);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo={marca.nombre} izquierda={<Simbolo size={28} />}
        derecha={<Pressable onPress={() => router.push('/ajustes')} accessibilityLabel="Ajustes"><Icono n="ajustes" /></Pressable>} />
      <Pestañas opciones={[{ v: 'parati', t: 'Para ti' }, { v: 'siguiendo', t: 'Siguiendo' }]} valor={modo} onCambio={setModo} />
      <ListaPosts posts={lista} vacio={modo === 'siguiendo' ? 'Sigue a gente para ver aquí lo que publica, en orden de llegada.' : undefined} />
      <BotonPublicar />
    </View>
  );
}
