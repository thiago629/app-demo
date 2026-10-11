import { ReactElement } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Post } from './Post';
import { Icono, Vacio } from './ui';
import { useTheme } from '../lib/theme';
import type { Post as TPost } from '../lib/types';

export function ListaPosts({ posts, cabecera, vacio = 'Aquí no hay nada todavía.' }: { posts: TPost[]; cabecera?: ReactElement; vacio?: string }) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <Post post={item} />}
      ListHeaderComponent={cabecera}
      ListEmptyComponent={<Vacio texto={vacio} />}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

export function BotonPublicar({ grupoId }: { grupoId?: string }) {
  const t = useTheme();
  return (
    <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
      <Pressable accessibilityLabel="Publicar" onPress={() => router.push({ pathname: '/publicar', params: grupoId ? { grupoId } : {} })}
        style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, elevation: 6 }}>
        <Icono n="pluma" color={t.accentText} size={26} />
      </Pressable>
    </View>
  );
}
