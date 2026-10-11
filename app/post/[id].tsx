import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEstado, visibles } from '../../src/lib/store';
import { Cabecera, Icono, Vacio } from '../../src/components/ui';
import { Post } from '../../src/components/Post';
import { BotonPublicar } from '../../src/components/Lista';

export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = useEstado((x) => x);
  const v = visibles(e);
  const post = v.find((p) => p.id === id);
  const padre = post?.respuestaA ? v.find((p) => p.id === post.respuestaA) : undefined;
  const respuestas = v.filter((p) => p.respuestaA === id).sort((a, b) => a.creado.localeCompare(b.creado));
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Publicación" izquierda={<Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}><Icono n="atras" /></Pressable>} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {padre && <Post post={padre} />}
        {post ? <Post post={post} detalle /> : <Vacio texto="Esta publicación ya no está disponible." />}
        {respuestas.map((r) => <Post key={r.id} post={r} />)}
      </ScrollView>
    </View>
  );
}
