import { Prisma } from '@prisma/client';

export const ESTUDIANTE_INCLUDE = {
  paisNacionalidad: true,
  paisResidencia: true,
  provinciaNacimiento: true,
  provinciaResidencia: true,
  cantonNacimiento: true,
  cantonResidencia: true,
  nacionalidad: true,
  pueblo: true,
  sectorEconomico: true,
  colegioProcedencia: true,
  composicionFamiliar: { orderBy: { id: 'asc' as const } },
  ingresosFamiliares: { orderBy: { id: 'asc' as const } },
  documentos: { orderBy: { id: 'asc' as const } },
} satisfies Prisma.EstudianteInclude;
