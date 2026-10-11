import { useEstado } from '../../src/lib/store';
import { PerfilVista } from '../../src/components/PerfilVista';

export default function MiPerfil() {
  const usuario = useEstado((e) => e.perfiles[e.sesion ?? '']?.usuario);
  return usuario ? <PerfilVista usuario={usuario} /> : null;
}
