import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { crearPrediccion } from '../../src/lib/store';
import { Boton, Cabecera, Campo, Icono } from '../../src/components/ui';

export default function NuevaPrediccion() {
  const t = useTheme();
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState(['', '']);
  const [dias, setDias] = useState(3);
  const listas = opciones.filter((o) => o.trim()).length >= 2 && pregunta.trim().length >= 5;
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Nueva predicción" izquierda={<Pressable onPress={() => router.back()}><Icono n="cerrar" /></Pressable>} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Campo etiqueta="¿Qué va a pasar?" value={pregunta} onChangeText={setPregunta} maxLength={120} placeholder="¿Quién gana la final?" />
        {opciones.map((o, i) => (
          <Campo key={i} etiqueta={`Opción ${i + 1}`} value={o} maxLength={40} onChangeText={(v) => setOpciones(opciones.map((x, j) => (j === i ? v : x)))} />
        ))}
        {opciones.length < 4 && <Boton titulo="Añadir opción" tipo="secundario" onPress={() => setOpciones([...opciones, ''])} />}
        <Text style={{ color: t.muted, fontWeight: '600' }}>Se cierran las apuestas en</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 3, 7].map((d) => (
            <Pressable key={d} onPress={() => setDias(d)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: dias === d ? t.accent : t.chip }}>
              <Text style={{ color: dias === d ? t.accentText : t.text, fontWeight: '700' }}>{d} {d === 1 ? 'día' : 'días'}</Text>
            </Pressable>
          ))}
        </View>
        <Boton titulo="Publicar predicción" desactivado={!listas} onPress={() => { if (crearPrediccion(pregunta, opciones, dias)) router.back(); }} />
      </ScrollView>
    </View>
  );
}
