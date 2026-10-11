import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { unirseGrupo, useEstado, visibles } from '../../src/lib/store';
import { Boton, Cabecera, Icono, Vacio } from '../../src/components/ui';
import { BotonPublicar, ListaPosts } from '../../src/components/Lista';
import { HojaDenuncia, Opcion } from '../../src/components/Post';

export default function GrupoVista() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = useEstado((x) => x);
  const [menu, setMenu] = useState(false);
  const [denuncia, setDenuncia] = useState(false);
  const g = e.grupos.find((x) => x.id === id);
  if (!g) return <Vacio texto="Este grupo no existe." />;
  const miembros = e.miembros.filter((m) => m.grupoId === g.id);
  const soyMiembro = miembros.some((m) => m.userId === e.sesion);
  const posts = visibles(e).filter((p) => p.grupoId === g.id).sort((a, b) => b.creado.localeCompare(a.creado));
  const cab = (
    <View style={{ padding: 16, gap: 10, borderBottomWidth: 1, borderColor: t.line }}>
      <Text style={{ color: t.text, fontSize: 24, fontWeight: '800' }}>{g.nombre}</Text>
      <Text style={{ color: t.muted, fontSize: 15 }}>{g.descripcion}</Text>
      <Text style={{ color: t.muted }}>{g.privado ? 'Grupo privado' : 'Grupo público'} · {miembros.length} miembros</Text>
      {g.creador !== e.sesion && <Boton titulo={soyMiembro ? 'Salir del grupo' : 'Unirme'} tipo={soyMiembro ? 'secundario' : 'primario'} onPress={() => unirseGrupo(g.id)} />}
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Grupo" izquierda={<Pressable onPress={() => router.back()}><Icono n="atras" /></Pressable>}
        derecha={<Pressable onPress={() => setMenu(true)} accessibilityLabel="Más opciones"><Icono n="mas" /></Pressable>} />
      <ListaPosts posts={posts} cabecera={cab} vacio={soyMiembro ? 'Abre la conversación con la primera publicación.' : 'Únete para participar.'} />
      {soyMiembro && <BotonPublicar grupoId={g.id} />}
      <Modal visible={menu} transparent animationType="fade" onRequestClose={() => setMenu(false)}>
        <Pressable style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }} onPress={() => setMenu(false)}>
          <View style={{ backgroundColor: t.card, padding: 12, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Opcion t="Denunciar grupo" peligro onPress={() => { setMenu(false); setDenuncia(true); }} />
            <Opcion t="Cancelar" onPress={() => setMenu(false)} />
          </View>
        </Pressable>
      </Modal>
      <HojaDenuncia visible={denuncia} onCerrar={() => setDenuncia(false)} objetivo={{ tipo: 'grupo', id: g.id }} />
    </View>
  );
}
