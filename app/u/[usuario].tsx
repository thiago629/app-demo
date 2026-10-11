import { useLocalSearchParams } from 'expo-router';
import { PerfilVista } from '../../src/components/PerfilVista';

export default function Perfil() {
  const { usuario } = useLocalSearchParams<{ usuario: string }>();
  return <PerfilVista usuario={usuario} conAtras />;
}
