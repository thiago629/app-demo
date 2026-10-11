import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { crearGrupo } from '../../src/lib/store';
import { Boton, Cabecera, Campo, Casilla, Icono } from '../../src/components/ui';

export default function NuevoGrupo() {
  const t = useTheme();
  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [privado, setPrivado] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Nuevo grupo" izquierda={<Pressable onPress={() => router.back()}><Icono n="cerrar" /></Pressable>} />
      <View style={{ padding: 20, gap: 16 }}>
        <Campo etiqueta="Nombre del grupo" value={nombre} onChangeText={setNombre} maxLength={60} />
        <Campo etiqueta="¿De qué va?" value={desc} onChangeText={setDesc} maxLength={300} multiline style={{ minHeight: 80 }} />
        <Casilla marcada={privado} onCambio={setPrivado}>
          <Text style={{ color: t.text, fontWeight: '600' }}>Grupo privado</Text>
          <Text style={{ color: t.muted, fontSize: 13 }}>Solo los miembros ven lo que se publica.</Text>
        </Casilla>
        <Boton titulo="Crear grupo" desactivado={nombre.trim().length < 3} onPress={() => {
          const id = crearGrupo(nombre, desc, privado);
          if (id) router.replace(`/grupo/${id}`);
        }} />
      </View>
    </View>
  );
}
