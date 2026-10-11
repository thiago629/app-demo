import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/lib/theme';
import { Boton, Simbolo } from '../src/components/ui';
import marca from '../src/lib/marca.json';

export default function Bienvenida() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, padding: 28, justifyContent: 'center', gap: 28 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Simbolo size={72} />
        <View style={{ borderWidth: 1, borderColor: t.accent, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: t.accent, fontWeight: '800', letterSpacing: 2 }}>{marca.nombre.toUpperCase()} · APP DE PRUEBA</Text>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Text style={{ color: t.text, fontSize: 40, fontWeight: '800', letterSpacing: -1 }}>{marca.eslogan}.</Text>
        <Text style={{ color: t.muted, fontSize: 17 }}>Publica lo que piensas, sube fotos, vídeos y memes, sigue #temas y crea grupos con tu gente.</Text>
      </View>
      <View style={{ gap: 12 }}>
        <Boton titulo="Crear cuenta" onPress={() => router.push('/registro')} />
        <Boton titulo="Ya tengo cuenta" tipo="secundario" onPress={() => router.push('/entrar')} />
      </View>
      <Text style={{ color: t.muted, fontSize: 12, textAlign: 'center' }}>
        Al registrarte aceptas los <Text style={{ color: t.accent }} onPress={() => router.push('/legal/terminos')}>Términos</Text> y la{' '}
        <Text style={{ color: t.accent }} onPress={() => router.push('/legal/privacidad')}>Política de privacidad</Text>. Solo mayores de 16 años.
      </Text>
    </View>
  );
}
