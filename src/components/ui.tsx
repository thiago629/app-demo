import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../lib/theme';

// ---------------------------------------------------------------- Logo
// Rombo de Zavnir: Λ (hablar) arriba en plata y V (escuchar) abajo
export function Simbolo({ size = 40 }: { size?: number }) {
  const t = useTheme();
  return (
    <Svg width={size} height={size * (576 / 536)} viewBox="244 224 536 576">
      <Path d="M512 224 L780 492 H668 L512 336 L356 492 H244 Z" fill={t.accent} />
      <Path d="M512 800 L780 532 H668 L512 688 L356 532 H244 Z" fill={t.text} />
    </Svg>
  );
}

// ---------------------------------------------------------------- Iconos (trazo 2px, 24x24)
const RUTAS: Record<string, string> = {
  casa: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  lupa: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4.3-4.3',
  grupo: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-4-4.9',
  campana: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0',
  persona: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 22a9 9 0 0 1 18 0',
  respuesta: 'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z',
  compartir: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  corazon: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z',
  guardar: 'M6 3h12v18l-6-4-6 4z',
  mas: 'M5 12h.01M12 12h.01M19 12h.01',
  pluma: 'M12 5v14M5 12h14',
  imagen: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15 9h.01',
  video: 'M3 6h12v12H3zM15 10l6-3v10l-6-3',
  meme: 'M4 4h16v16H4zM8 9h.01M16 9h.01M8 15c2 2 6 2 8 0',
  atras: 'M15 5l-7 7 7 7',
  ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  cerrar: 'M6 6l12 12M18 6L6 18',
  candado: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  check: 'M4 12l5 5L20 6',
  trofeo: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4',
  rayo: 'M13 2L4 14h7l-1 8 9-12h-7z',
  reloj: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
};

export function Icono({ n, size = 22, color, fill }: { n: keyof typeof RUTAS | string; size?: number; color?: string; fill?: string }) {
  const t = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={RUTAS[n]} fill={fill ?? 'none'} stroke={color ?? t.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ---------------------------------------------------------------- Avatar
export function Avatar({ nombre, color, size = 44 }: { nombre: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#F6F3EC', fontWeight: '700', fontSize: size * 0.42 }}>{nombre.trim()[0]?.toUpperCase() ?? '?'}</Text>
    </View>
  );
}

// ---------------------------------------------------------------- Botones y campos
export function Boton({ titulo, onPress, tipo = 'primario', desactivado, estilo }: {
  titulo: string; onPress: () => void; tipo?: 'primario' | 'secundario' | 'peligro'; desactivado?: boolean; estilo?: ViewStyle;
}) {
  const t = useTheme();
  const bg = tipo === 'primario' ? t.accent : 'transparent';
  const fg = tipo === 'primario' ? t.accentText : tipo === 'peligro' ? t.danger : t.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={desactivado}
      onPress={onPress}
      style={({ pressed }) => [{
        backgroundColor: bg, borderColor: tipo === 'primario' ? bg : tipo === 'peligro' ? t.danger : t.line,
        borderWidth: 1, borderRadius: 999, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center',
        opacity: desactivado ? 0.4 : pressed ? 0.8 : 1,
      }, estilo]}
    >
      <Text style={{ color: fg, fontWeight: '700', fontSize: 15 }}>{titulo}</Text>
    </Pressable>
  );
}

export function Campo({ etiqueta, ...props }: TextInputProps & { etiqueta: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={t.muted}
        {...props}
        style={[{ borderWidth: 1, borderColor: t.line, borderRadius: 12, padding: 12, color: t.text, backgroundColor: t.card, fontSize: 16 }, props.style]}
      />
    </View>
  );
}

export function Casilla({ marcada, onCambio, children }: { marcada: boolean; onCambio: (v: boolean) => void; children: ReactNode }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: marcada }} onPress={() => onCambio(!marcada)}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: marcada ? t.accent : t.muted, backgroundColor: marcada ? t.accent : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {marcada && <Icono n="check" size={14} color={t.accentText} />}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

export function Pestañas<T extends string>({ opciones, valor, onCambio }: { opciones: { v: T; t: string }[]; valor: T; onCambio: (v: T) => void }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: t.line }}>
      {opciones.map((o) => (
        <Pressable key={o.v} onPress={() => onCambio(o.v)} style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }} accessibilityRole="tab" accessibilityState={{ selected: valor === o.v }}>
          <Text style={{ color: valor === o.v ? t.text : t.muted, fontWeight: valor === o.v ? '700' : '500', fontSize: 15 }}>{o.t}</Text>
          {valor === o.v && <View style={{ position: 'absolute', bottom: 0, height: 3, width: 48, borderRadius: 2, backgroundColor: t.accent }} />}
        </Pressable>
      ))}
    </View>
  );
}

export function Vacio({ texto }: { texto: string }) {
  const t = useTheme();
  return <Text style={{ color: t.muted, textAlign: 'center', padding: 32, fontSize: 15 }}>{texto}</Text>;
}

export function Cabecera({ titulo, izquierda, derecha }: { titulo: string; izquierda?: ReactNode; derecha?: ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: t.line, backgroundColor: t.bg }}>
      {izquierda}
      <Text style={{ flex: 1, color: t.text, fontSize: 20, fontWeight: '800' }}>{titulo}</Text>
      {derecha}
    </View>
  );
}
