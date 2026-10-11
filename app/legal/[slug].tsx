import { Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { DOCUMENTOS, textoLegal } from '../../src/lib/legal';
import { Cabecera, Icono, Vacio } from '../../src/components/ui';
import { Markdown } from '../../src/components/Markdown';

export default function Legal() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const doc = DOCUMENTOS.find((d) => d.slug === slug);
  const texto = textoLegal(slug);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo={doc?.titulo ?? 'Legal'} izquierda={<Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}><Icono n="atras" /></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
        {texto ? <Markdown texto={texto} /> : <Vacio texto="Documento no encontrado." />}
      </ScrollView>
    </View>
  );
}
