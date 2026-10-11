import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { useTheme } from '../../src/lib/theme';
import { apelar, marcarLeidas, useEstado } from '../../src/lib/store';
import { hace } from '../../src/lib/texto';
import { Avatar, Boton, Cabecera, Campo, Simbolo, Vacio } from '../../src/components/ui';

const FRASE = {
  me_gusta: 'le ha gustado tu publicación',
  respuesta: 'te ha respondido',
  mencion: 'te ha mencionado',
  seguidor: 'ha empezado a seguirte',
  compartido: 'ha compartido tu publicación',
  grupo: 'te ha invitado a un grupo',
  moderacion: '',
  ring: 'tiene novedades para ti en el Ring',
};

const SIN_NOTIS: never[] = [];

export default function Notificaciones() {
  const t = useTheme();
  const lista = useEstado((e) => e.notificaciones[e.sesion ?? ''] ?? SIN_NOTIS);
  const perfiles = useEstado((e) => e.perfiles);
  const enFoco = useIsFocused();
  const [apelando, setApelando] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  useEffect(() => { if (enFoco) return () => marcarLeidas(); }, [enFoco]);
  return (
    <View style={{ flex: 1 }}>
      <Cabecera titulo="Notificaciones" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {lista.length === 0 && <Vacio texto="Cuando alguien te mencione, te responda o te siga, lo verás aquí." />}
        {lista.map((n) => {
          const actor = n.actor ? perfiles[n.actor] : undefined;
          return (
            <Pressable key={n.id} onPress={() => n.debateId ? router.push(`/ring/${n.debateId}`) : n.postId ? router.push(`/post/${n.postId}`) : actor && router.push(`/u/${actor.usuario}`)}
              style={{ flexDirection: 'row', gap: 12, padding: 16, borderBottomWidth: 1, borderColor: t.line, backgroundColor: n.leida ? t.bg : t.chip }}>
              {actor ? <Avatar nombre={actor.nombre} color={actor.avatarColor} size={36} /> : <Simbolo size={36} />}
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={{ color: t.text, fontSize: 15 }}>
                  {actor && <Text style={{ fontWeight: '700' }}>{actor.nombre} </Text>}
                  {n.tipo === 'moderacion' ? n.texto : FRASE[n.tipo]}
                  <Text style={{ color: t.muted }}> · {hace(n.creado)}</Text>
                </Text>
                {n.tipo === 'moderacion' && n.denunciaId && n.texto?.startsWith('Hemos retirado') && (
                  apelando === n.id ? (
                    <View style={{ gap: 8 }}>
                      <Campo etiqueta="¿Por qué crees que nos hemos equivocado?" value={motivo} onChangeText={setMotivo} multiline />
                      <Boton titulo="Enviar recurso" desactivado={motivo.trim().length < 10} onPress={() => { apelar(n.denunciaId!, motivo); setApelando(null); setMotivo(''); }} />
                    </View>
                  ) : <Boton titulo="Recurrir la decisión" tipo="secundario" onPress={() => setApelando(n.id)} />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
