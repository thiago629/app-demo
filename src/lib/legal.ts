import { TEXTOS, VERSION_LEGAL } from './legal-textos';
export { VERSION_LEGAL };

export const DOCUMENTOS = [
  { slug: 'privacidad', titulo: 'Política de privacidad' },
  { slug: 'terminos', titulo: 'Términos y condiciones' },
  { slug: 'normas', titulo: 'Normas de la comunidad' },
  { slug: 'cookies', titulo: 'Política de cookies' },
  { slug: 'aviso-legal', titulo: 'Aviso legal' },
  { slug: 'denuncias', titulo: 'Cómo funcionan las denuncias' },
] as const;

export const textoLegal = (slug: string) => TEXTOS[slug] ?? '';
