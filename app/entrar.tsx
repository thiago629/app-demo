import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/lib/theme';
import { entrar } from '../src/lib/store';
import { Boton, Cabecera, Campo, Icono } from '../src/components/ui';

export default function Entrar() {
  const t = useTheme();
  const [quien, setQuien] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Iniciar sesión" izquierda={<Pressable onPress={() => router.back()}><Icono n="atras" /></Pressable>} />
      <View style={{ padding: 20, gap: 16 }}>
        <Campo etiqueta="Email o usuario" value={quien} onChangeText={setQuien} autoCapitalize="none" autoComplete="username" />
        <Campo etiqueta="Contraseña" value={clave} onChangeText={setClave} secureTextEntry autoComplete="password" />
        {error && <Text style={{ color: t.danger }}>{error}</Text>}
        <Boton titulo="Entrar" desactivado={!quien} onPress={() => setError(entrar(quien))} />
        <Text style={{ color: t.muted, fontSize: 13 }}>Modo demostración: la contraseña no se comprueba. Prueba con @luciamartin.</Text>
      </View>
    </View>
  );
}
