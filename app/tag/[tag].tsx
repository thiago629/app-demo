import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEstado, capsulaAbierta, visibles } from '../../src/lib/store';
import { hashtagsDe } from '../../src/lib/texto';
import { Cabecera, Icono } from '../../src/components/ui';
import { BotonPublicar, ListaPosts } from '../../src/components/Lista';

export default function Tag() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const e = useEstado((x) => x);
  const posts = visibles(e).filter((p) => (capsulaAbierta(p) || p.autor === e.sesion) && hashtagsDe(p.texto).includes(tag.toLowerCase())).sort((a, b) => b.creado.localeCompare(a.creado));
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo={`#${tag}`} izquierda={<Pressable onPress={() => router.back()}><Icono n="atras" /></Pressable>} />
      <ListaPosts posts={posts} vacio={`Nadie ha usado #${tag} todavía. ¡Sé el primero!`} />
      <BotonPublicar />
    </View>
  );
}
