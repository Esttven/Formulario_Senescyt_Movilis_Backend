import { Prisma } from '@prisma/client';
import { EstudianteFieldsDto, EstudianteResponseDto, numericOrNull } from '../dto/estudiante.dto';
import { ComposicionFamiliarDto, IngresoFamiliarDto } from '../dto/familia.dto';

const DECIMAL_FIELDS = [
  'montoBeca',
  'porcentajeBecaCoberturaArancel',
  'porcentajeBecaCoberturaManutencion',
  'montoAyudaEconomica',
  'montoCreditoEducativo',
  'ingresoTotalHogar',
  'egresoVivienda',
  'egresoAlimentacion',
  'egresoEducacion',
  'egresoIndumentaria',
  'egresoTransporte',
  'egresoSalud',
  'egresoServiciosBasicos',
  'egresoOtros',
  'totalEgresos',
] as const;

const DATE_FIELDS = ['fechaNacimiento', 'fechaInicioCarrera', 'fechaMatricula'] as const;

const SCALAR_FIELDS = [
  'tipoDocumento',
  'numeroIdentificacion',
  'primerApellido',
  'segundoApellido',
  'primerNombre',
  'segundoNombre',
  'sexo',
  'genero',
  'estadoCivil',
  'etnia',
  'tipoSangre',
  'discapacidad',
  'porcentajeDiscapacidad',
  'numCarnetConadis',
  'tipoDiscapacidad',
  'fechaNacimiento',
  'paisNacionalidadId',
  'provinciaNacimientoId',
  'cantonNacimientoId',
  'paisResidenciaId',
  'provinciaResidenciaId',
  'cantonResidenciaId',
  'nacionalidadId',
  'puebloId',
  'sectorEconomicoId',
  'tipoColegioId',
  'colegioProcedenciaId',
  'nombreColegioProcedencia',
  'tituloBachiller',
  'anioGraduacion',
  'modalidadCarrera',
  'jornadaCarrera',
  'fechaInicioCarrera',
  'fechaMatricula',
  'tipoMatricula',
  'duracionPeriodoAcademico',
  'nivelAcademico',
  'haRepetidoAlMenosUnaMateria',
  'paralelo',
  'haPerdidoLaGratuidad',
  'recibePensionDiferenciada',
  'carrera',
  'disenoCurricular',
  'periodoAcademico',
  'estudianteOcupacion',
  'trabajoEspecifique',
  'ingresosEstudiante',
  'bonoDesarrollo',
  'haRealizadoPracticasPreprofesionales',
  'nroHorasPracticasPreprofesionalesPorPeriodo',
  'entornoInstitucionalPracticasProfesionales',
  'sectorEconomicoPracticaProfesional',
  'tipoBeca',
  'primeraRazonBeca',
  'segundaRazonBeca',
  'terceraRazonBeca',
  'cuartaRazonBeca',
  'quintaRazonBeca',
  'sextaRazonBeca',
  'montoBeca',
  'porcentajeBecaCoberturaArancel',
  'porcentajeBecaCoberturaManutencion',
  'financiamientoBeca',
  'montoAyudaEconomica',
  'montoCreditoEducativo',
  'financiamientoFondosPropios',
  'financiamientoAyudaPadres',
  'financiamientoTarjetaCredito',
  'financiamientoEntidadFinanciera',
  'financiamientoTercerasPersonas',
  'financiamientoQuienes',
  'participaEnProyectoVinculacionSociedad',
  'tipoAlcanceProyectoVinculacion',
  'correoElectronico',
  'correoInstitucional',
  'numeroCelular',
  'numeroConvencional',
  'direccionDomicilio',
  'lugarResidencia',
  'referenciaDomiciliaria',
  'parroquiaProcedencia',
  'parroquiaResidencia',
  'barrioSector',
  'paisProcedenciaExtranjero',
  'estadoProvinciaProcedencia',
  'cantonProcedencia',
  'barrioSectorProcedencia',
  'direccionDomicilioProcedencia',
  'alergias',
  'presentaAlergiaImportante',
  'medicamentos',
  'enfermedadCatastrofica',
  'presentaCarnetDiscapacidad',
  'referenciaPersonalNombre',
  'referenciaPersonalParentesco',
  'referenciaPersonalTelefono',
  'referenciaPersonalCorreo',
  'contactoEmergenciaNombre',
  'contactoEmergenciaParentesco',
  'contactoEmergenciaTelefono',
  'contactoEmergenciaCorreo',
  'nivelFormacionPadre',
  'nivelFormacionMadre',
  'ingresoTotalHogar',
  'cantidadMiembrosHogar',
  'zonaVivienda',
  'coordenadasVivienda',
  'croquisViviendaUrl',
  'tipoPropiedadVivienda',
  'estructuraVivienda',
  'estructuraViviendaEspecifique',
  'tipoVivienda',
  'serviciosDisponibles',
  'servicioEnergiaElectrica',
  'servicioAguaPotable',
  'servicioAlcantarillado',
  'servicioTelefonoFijo',
  'servicioInternet',
  'servicioTvCable',
  'servicioPlanDatos',
  'cantidadBanos',
  'cantidadHabitaciones',
  'comparteHabitacion',
  'conQuienVive',
  'tamanoViviendaSuficiente',
  'dinamicaFamiliar',
  'violenciaFamiliar',
  'tipoViolenciaFamiliar',
  'estudianteCabezaFamiliar',
  'familiaDiscapacidadEnfermedadCatastrofica',
  'familiaProblemaSalud',
  'familiaParentesco',
  'familiaServiciosMedicos',
  'familiaServiciosMedicosDetalle',
  'egresoVivienda',
  'egresoAlimentacion',
  'egresoEducacion',
  'egresoIndumentaria',
  'egresoTransporte',
  'egresoSalud',
  'egresoServiciosBasicos',
  'egresoOtros',
  'totalEgresos',
  'tipoComprobante',
  'facturacionNombre',
  'facturacionTipoIdentificacion',
  'facturacionIdentificacion',
  'facturacionDireccion',
  'facturacionCorreo',
  'facturacionTelefono',
  'mantenerDatosFacturacion',
  'copiaCedula',
  'copiaPapeleta',
  'certificadoRegistroTitulo',
  'justificacionRetrasoDocumentos',
] as const;

const isDefined = (value: unknown): boolean => value !== undefined;

const toDate = (value: unknown): Date | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === '' || value === 'NA') return null;
  return new Date(String(value));
};

const toDecimal = (value: unknown): Prisma.Decimal | null | undefined => {
  const normalized = numericOrNull({ value });
  if (normalized === undefined) return undefined;
  if (normalized === null) return null;
  return new Prisma.Decimal(normalized as number);
};

export function toPrismaEstudianteData(
  dto: EstudianteFieldsDto,
): Prisma.EstudianteUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  const source = dto as Record<string, unknown>;

  for (const field of SCALAR_FIELDS) {
    if (isDefined(source[field])) data[field] = source[field];
  }
  for (const field of DECIMAL_FIELDS) {
    if (isDefined(source[field])) data[field] = toDecimal(source[field]);
  }
  for (const field of DATE_FIELDS) {
    if (isDefined(source[field])) data[field] = toDate(source[field]);
  }

  return data as Prisma.EstudianteUncheckedCreateInput;
}

export function toPrismaComposicionFamiliarData(
  row: ComposicionFamiliarDto,
): Prisma.ComposicionFamiliarUncheckedCreateWithoutEstudianteInput {
  return {
    nombresApellidos: row.nombresApellidos,
    fechaNacimiento: toDate(row.fechaNacimiento) ?? null,
    cedulaIdentidad: row.cedulaIdentidad ?? null,
    estadoCivil: row.estadoCivil ?? null,
    parentesco: row.parentesco ?? null,
    nivelEstudios: row.nivelEstudios ?? null,
    titulo: row.titulo ?? null,
    laborOcupacion: row.laborOcupacion ?? null,
  };
}

export function toPrismaIngresoFamiliarData(
  row: IngresoFamiliarDto,
): Prisma.IngresoFamiliarUncheckedCreateWithoutEstudianteInput {
  return {
    nombresApellidos: row.nombresApellidos,
    parentesco: row.parentesco ?? null,
    actividadLaboral: row.actividadLaboral ?? null,
    ingresoMensual: toDecimal(row.ingresoMensual) ?? null,
    ingresosExtras: toDecimal(row.ingresosExtras) ?? null,
    total: toDecimal(row.total) ?? null,
  };
}

type CatalogRelation = { id: string; codigo: number | null; nombre: string } | null;
type StudentRecord = Record<string, any>;

const relation = (value: StudentRecord | null | undefined): CatalogRelation =>
  value ? { id: value.id, codigo: value.codigo ?? null, nombre: value.nombre } : null;

const serializeValue = (value: unknown): unknown => {
  if (value instanceof Prisma.Decimal) return value.toString();
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
};

export function toEstudianteResponseDto(record: StudentRecord): EstudianteResponseDto {
  const response: Record<string, unknown> = {};
  for (const field of SCALAR_FIELDS) {
    if (field in record) response[field] = serializeValue(record[field]);
  }

  Object.assign(response, {
    id: record.id,
    createdAt: record.createdAt?.toISOString(),
    updatedAt: record.updatedAt?.toISOString(),
    registroFichaEstudiantilCompletado: record.registroFichaEstudiantilCompletado,
    registroFichaSocioeconomicaCompletado: record.registroFichaSocioeconomicaCompletado,
    registroDatosFacturacionCompletado: record.registroDatosFacturacionCompletado,
    estadoRegistro: record.estadoRegistro,
    Pais_Estudiante_paisNacionalidadIdToPais: relation(record.paisNacionalidad),
    Pais_Estudiante_paisResidenciaIdToPais: relation(record.paisResidencia),
    Provincia_Estudiante_provinciaNacimientoIdToProvincia: relation(record.provinciaNacimiento),
    Provincia_Estudiante_provinciaResidenciaIdToProvincia: relation(record.provinciaResidencia),
    Canton_Estudiante_cantonNacimientoIdToCanton: relation(record.cantonNacimiento),
    Canton_Estudiante_cantonResidenciaIdToCanton: relation(record.cantonResidencia),
    composicionFamiliar: record.composicionFamiliar ?? [],
    ingresosFamiliares: record.ingresosFamiliares ?? [],
    documentos: record.documentos ?? [],
  });

  return response as unknown as EstudianteResponseDto;
}
