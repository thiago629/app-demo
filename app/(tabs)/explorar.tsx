import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { tendencias, useEstado, capsulaAbierta, visibles } from '../../src/lib/store';
import { Avatar, Icono } from '../../src/components/ui';
import { Post } from '../../src/components/Post';

export default function Explorar() {
  const t = useTheme();
  const [q, setQ] = useState('');
  const e = useEstado((x) => x);
  const top = useMemo(() => tendencias(e), [e]);
  const busca = q.trim().toLowerCase().replace(/^[#@]/, '');
  const personas = busca ? Object.values(e.perfiles).filter((p) => p.usuario.toLowerCase().includes(busca) || p.nombre.toLowerCase().includes(busca)).slice(0, 5) : [];
  const posts = busca ? visibles(e).filter((p) => (capsulaAbierta(p) || p.autor === e.sesion) && p.texto.toLowerCase().includes(busca)).slice(0, 20) : [];
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, paddingHorizontal: 14, borderRadius: 999, backgroundColor: t.chip }}>
        <Icono n="lupa" size={18} color={t.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Buscar personas, #temas o palabras" placeholderTextColor={t.muted} style={{ flex: 1, paddingVertical: 12, color: t.text, fontSize: 16 }} autoCapitalize="none" />
      </View>
      {busca ? (
        <>
          {personas.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/u/${p.usuario}`)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 }}>
              <Avatar nombre={p.nombre} color={p.avatarColor} size={40} />
              <View><Text style={{ color: t.text, fontWeight: '700' }}>{p.nombre}</Text><Text style={{ color: t.muted }}>@{p.usuario}</Text></View>
            </Pressable>
          ))}
          {posts.map((p) => <Post key={p.id} post={p} />)}
        </>
      ) : (
        <>
          <Text style={{ color: t.text, fontSize: 20, fontWeight: '800', paddingHorizontal: 16, marginBottom: 4 }}>Tendencias</Text>
          {top.map((x, i) => (
            <Pressable key={x.tag} onPress={() => router.push(`/tag/${encodeURIComponent(x.tag)}`)} style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ color: t.muted, fontSize: 12 }}>{i + 1} · Tendencia</Text>
              <Text style={{ color: t.text, fontSize: 16, fontWeight: '700' }}>#{x.tag}</Text>
              <Text style={{ color: t.muted, fontSize: 12 }}>{x.n} {x.n === 1 ? 'publicación' : 'publicaciones'}</Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}
