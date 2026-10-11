import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../lib/theme';
import { racha, useEstado } from '../lib/store';

const IMAGENES = {
  normal: require('../../assets/racha/rachi-normal.png'),
  fuego: require('../../assets/racha/rachi-fuego.png'),
  hielo: require('../../assets/racha/rachi-hielo.png'),
};

export function RachiImagen({ modo, size }: { modo: keyof typeof IMAGENES; size: number }) {
  return <Image source={IMAGENES[modo]} style={{ width: size, height: size }} resizeMode="contain" accessibilityIgnoresInvertColors />;
}

// Insignia pequeña para la cabecera: Rachi + días de racha
export function InsigniaRacha() {
  const t = useTheme();
  const e = useEstado((x) => x);
  if (!e.sesion) return null;
  const r = racha(e, e.sesion);
  const color = r.modo === 'fuego' ? '#FF8A1F' : r.modo === 'hielo' ? '#6FB3E6' : t.muted;
  return (
    <Pressable onPress={() => router.push('/racha')} accessibilityLabel={`Racha de ${r.dias} días`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6 }}>
      <RachiImagen modo={r.modo} size={26} />
      <Text style={{ color, fontWeight: '900', fontSize: 16, fontVariant: ['tabular-nums'] }}>{r.dias}</Text>
    </Pressable>
  );
}
