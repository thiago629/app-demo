import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/lib/theme';
import { EDAD_MINIMA, registrar } from '../src/lib/store';
import { Boton, Cabecera, Campo, Casilla, Icono } from '../src/components/ui';

export default function Registro() {
  const t = useTheme();
  const [f, setF] = useState({ email: '', clave: '', usuario: '', nombre: '', fechaNacimiento: '', aceptaTerminos: false, aceptaPrivacidad: false });
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (v: string | boolean) => setF({ ...f, [k]: v });
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Crear cuenta" izquierda={<Pressable onPress={() => router.back()}><Icono n="atras" /></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 160 }}>
        <Campo etiqueta="Nombre" value={f.nombre} onChangeText={set('nombre')} maxLength={50} />
        <Campo etiqueta="Usuario (@)" value={f.usuario} onChangeText={set('usuario')} autoCapitalize="none" maxLength={20} placeholder="tu_usuario" />
        <Campo etiqueta="Email" value={f.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <Campo etiqueta="Contraseña (mínimo 8 caracteres)" value={f.clave} onChangeText={set('clave')} secureTextEntry autoComplete="new-password" />
        <Campo etiqueta="Fecha de nacimiento" value={f.fechaNacimiento} onChangeText={set('fechaNacimiento')} placeholder="AAAA-MM-DD" maxLength={10} />
        <Text style={{ color: t.muted, fontSize: 12, marginTop: -8 }}>
          Necesitamos tu edad para cumplir la ley: hay que tener al menos {EDAD_MINIMA} años. No se muestra en tu perfil.
        </Text>
        <Casilla marcada={f.aceptaTerminos} onCambio={set('aceptaTerminos')}>
          <Text style={{ color: t.text }}>He leído y acepto los <Text style={{ color: t.accent }} onPress={() => router.push('/legal/terminos')}>Términos y condiciones</Text> y las <Text style={{ color: t.accent }} onPress={() => router.push('/legal/normas')}>Normas de la comunidad</Text>.</Text>
        </Casilla>
        <Casilla marcada={f.aceptaPrivacidad} onCambio={set('aceptaPrivacidad')}>
          <Text style={{ color: t.text }}>He leído la <Text style={{ color: t.accent }} onPress={() => router.push('/legal/privacidad')}>Política de privacidad</Text>.</Text>
        </Casilla>
        {error && <Text style={{ color: t.danger }}>{error}</Text>}
        <Boton titulo="Crear cuenta" onPress={() => {
          if (f.clave.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
          setError(registrar(f));
        }} />
      </ScrollView>
    </View>
  );
}
