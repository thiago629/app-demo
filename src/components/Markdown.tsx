import { Text, View } from 'react-native';
import { useTheme } from '../lib/theme';

// Visor de Markdown mínimo para los textos legales (títulos, listas, citas, tablas y negritas)
function Linea({ texto, estilo }: { texto: string; estilo: object }) {
  const t = useTheme();
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={estilo}>
      {partes.map((p, i) => p.startsWith('**') ? <Text key={i} style={{ fontWeight: '700', color: t.text }}>{p.slice(2, -2)}</Text> : p.replace(/`/g, ''))}
    </Text>
  );
}

export function Markdown({ texto }: { texto: string }) {
  const t = useTheme();
  const base = { color: t.text, fontSize: 15, lineHeight: 22 };
  return (
    <View style={{ gap: 8 }}>
      {texto.split('\n').map((l, i) => {
        if (!l.trim() || /^\|?\s*-{3,}/.test(l)) return null;
        if (l.startsWith('# ')) return <Linea key={i} texto={l.slice(2)} estilo={{ ...base, fontSize: 24, fontWeight: '800', marginTop: 8 }} />;
        if (l.startsWith('## ')) return <Linea key={i} texto={l.slice(3)} estilo={{ ...base, fontSize: 19, fontWeight: '800', marginTop: 12 }} />;
        if (l.startsWith('### ')) return <Linea key={i} texto={l.slice(4)} estilo={{ ...base, fontSize: 16, fontWeight: '700', marginTop: 8 }} />;
        if (l.startsWith('> ')) return <View key={i} style={{ borderLeftWidth: 3, borderColor: t.accent, paddingLeft: 10 }}><Linea texto={l.slice(2)} estilo={{ ...base, color: t.muted }} /></View>;
        if (/^\s*[-*] /.test(l)) return <Linea key={i} texto={'•  ' + l.replace(/^\s*[-*] /, '')} estilo={{ ...base, paddingLeft: 8 }} />;
        if (l.startsWith('|')) return <Linea key={i} texto={l.split('|').filter(Boolean).map((c) => c.trim()).join('  ·  ')} estilo={{ ...base, fontSize: 13 }} />;
        return <Linea key={i} texto={l} estilo={base} />;
      })}
    </View>
  );
}
