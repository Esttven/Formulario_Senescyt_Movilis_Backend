export type ArchivoTipo =
  | 'titulo-bachiller'
  | 'croquis-vivienda'
  | 'copia-cedula'
  | 'copia-papeleta'
  | 'certificado-registro-titulo';

export const ARCHIVO_CONFIG: Record<
  ArchivoTipo,
  {
    field:
      | 'tituloBachiller'
      | 'croquisViviendaUrl'
      | 'copiaCedula'
      | 'copiaPapeleta'
      | 'certificadoRegistroTitulo';
    documentType: string;
    folder: string;
    allowedMime: string[];
    allowedExtensions: string[];
    maxBytes: number;
  }
> = {
  'titulo-bachiller': {
    field: 'tituloBachiller',
    documentType: 'TITULO_BACHILLER',
    folder: 'titulo',
    allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
  'croquis-vivienda': {
    field: 'croquisViviendaUrl',
    documentType: 'CROQUIS_VIVIENDA',
    folder: 'maps',
    allowedMime: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    maxBytes: 5 * 1024 * 1024,
  },
  'copia-cedula': {
    field: 'copiaCedula',
    documentType: 'COPIA_CEDULA',
    folder: 'identificacion',
    allowedMime: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
  'copia-papeleta': {
    field: 'copiaPapeleta',
    documentType: 'COPIA_PAPELETA',
    folder: 'identificacion',
    allowedMime: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
  'certificado-registro-titulo': {
    field: 'certificadoRegistroTitulo',
    documentType: 'CERTIFICADO_REGISTRO_TITULO',
    folder: 'titulo',
    allowedMime: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
    maxBytes: 10 * 1024 * 1024,
  },
};
