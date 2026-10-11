// Página pública de borrado de cuenta (Google Play exige una URL accesible sin la app)
import { ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/lib/theme';
import { Boton, Simbolo } from '../src/components/ui';
import marca from '../src/lib/marca.json';

export default function EliminarCuenta() {
  const t = useTheme();
  const p = { color: t.text, fontSize: 16, lineHeight: 24 };
  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 14, paddingBottom: 140 }}>
      <Simbolo size={48} />
      <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Borrar tu cuenta de {marca.nombre}</Text>
      <Text style={p}>Desde la app: Perfil › Ajustes › Cuenta › Borrar mi cuenta.</Text>
      <Text style={p}>Sin la app: escribe a privacidad@{marca.dominio} desde el email de tu cuenta con el asunto «Borrar mi cuenta».</Text>
      <Text style={p}>Qué se borra: tu perfil, publicaciones, fotos, vídeos, me gusta, seguidores, grupos que creaste y tus datos personales. Todo deja de verse al momento y se elimina en un máximo de 30 días.</Text>
      <Text style={p}>Qué se conserva: solo lo que la ley nos obliga a guardar (por ejemplo, registros de denuncias a autoridades), bloqueado y durante el plazo legal. Lo explicamos en la Política de privacidad.</Text>
      <Boton titulo="Leer la Política de privacidad" tipo="secundario" onPress={() => router.push('/legal/privacidad')} />
    </ScrollView>
  );
}
