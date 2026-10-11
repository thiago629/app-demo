import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { crearDebate } from '../../src/lib/store';
import { Boton, Cabecera, Campo, Icono } from '../../src/components/ui';

export default function NuevoDebate() {
  const t = useTheme();
  const [tema, setTema] = useState('');
  const [rival, setRival] = useState('');
  const [error, setError] = useState<string | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Nuevo reto" izquierda={<Pressable onPress={() => router.back()}><Icono n="cerrar" /></Pressable>} />
      <View style={{ padding: 20, gap: 16 }}>
        <Campo etiqueta="¿Sobre qué queréis debatir?" value={tema} onChangeText={setTema} maxLength={120} placeholder="¿Pizza con piña: sí o no?" />
        <Campo etiqueta="Rival (@usuario). Déjalo vacío para un reto abierto" value={rival} onChangeText={setRival} autoCapitalize="none" placeholder="@dani_memes" />
        <Text style={{ color: t.muted, fontSize: 13 }}>Cada uno tiene 3 intervenciones por turnos. Después la gente vota durante 24 horas y el ganador suma una victoria en el ranking.</Text>
        {error && <Text style={{ color: t.danger }}>{error}</Text>}
        <Boton titulo="Subir al Ring" desactivado={tema.trim().length < 5} onPress={() => {
          const id = crearDebate(tema, rival);
          if (!id) return setError('No encontramos a ese usuario. Revisa el @ o déjalo vacío.');
          router.replace(`/ring/${id}`);
        }} />
      </View>
    </View>
  );
}
