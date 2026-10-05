export interface RegistroEstado {
  registroFichaEstudiantilCompletado: boolean;
  registroFichaSocioeconomicaCompletado: boolean;
  registroDatosFacturacionCompletado: boolean;
  estadoRegistro: 'PENDIENTE' | 'INCOMPLETO' | 'COMPLETO';
}

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '' && value !== 'NA';

const hasAll = (record: Record<string, any>, fields: string[]): boolean =>
  fields.every((field) => isPresent(record[field]));

export function esFichaEstudiantilCompleta(record: Record<string, any>): boolean {
  const baseFields = [
    'tipoDocumento',
    'numeroIdentificacion',
    'fechaNacimiento',
    'primerApellido',
    'primerNombre',
    'sexo',
    'genero',
    'estadoCivil',
    'etnia',
    'tipoSangre',
    'discapacidad',
    'paisNacionalidadId',
    'paisResidenciaId',
    'carrera',
    'modalidadCarrera',
    'jornadaCarrera',
    'tipoMatricula',
    'nivelAcademico',
    'paralelo',
    'estudianteOcupacion',
    'ingresosEstudiante',
    'bonoDesarrollo',
    'haRealizadoPracticasPreprofesionales',
    'participaEnProyectoVinculacionSociedad',
    'correoElectronico',
    'numeroCelular',
  ];

  if (!hasAll(record, baseFields)) return false;
  if (
    record.discapacidad === 'SI' &&
    !hasAll(record, ['porcentajeDiscapacidad', 'tipoDiscapacidad'])
  ) {
    return false;
  }
  if (
    record.haRealizadoPracticasPreprofesionales === 'SI' &&
    !hasAll(record, [
      'nroHorasPracticasPreprofesionalesPorPeriodo',
      'entornoInstitucionalPracticasProfesionales',
      'sectorEconomicoPracticaProfesional',
    ])
  ) {
    return false;
  }
  if (
    record.participaEnProyectoVinculacionSociedad === 'SI' &&
    !isPresent(record.tipoAlcanceProyectoVinculacion)
  ) {
    return false;
  }

  return true;
}

export function esFichaSocioeconomicaCompleta(record: Record<string, any>): boolean {
  const fields = [
    'nivelFormacionPadre',
    'nivelFormacionMadre',
    'ingresoTotalHogar',
    'cantidadMiembrosHogar',
    'direccionDomicilio',
    'zonaVivienda',
    'tipoPropiedadVivienda',
    'tipoVivienda',
    'cantidadBanos',
    'cantidadHabitaciones',
    'tamanoViviendaSuficiente',
    'violenciaFamiliar',
    'estudianteCabezaFamiliar',
    'familiaDiscapacidadEnfermedadCatastrofica',
    'familiaServiciosMedicos',
  ];

  return hasAll(record, fields);
}

export function esFacturacionCompleta(record: Record<string, any>): boolean {
  return hasAll(record, [
    'facturacionNombre',
    'facturacionTipoIdentificacion',
    'facturacionIdentificacion',
    'facturacionDireccion',
    'facturacionCorreo',
    'facturacionTelefono',
  ]);
}

export function obtenerEstadoRegistro(record: Record<string, any>): RegistroEstado {
  const registroFichaEstudiantilCompletado = esFichaEstudiantilCompleta(record);
  const registroFichaSocioeconomicaCompletado = esFichaSocioeconomicaCompleta(record);
  const registroDatosFacturacionCompletado = esFacturacionCompleta(record);
  const anyPhaseComplete =
    registroFichaEstudiantilCompletado ||
    registroFichaSocioeconomicaCompletado ||
    registroDatosFacturacionCompletado;
  const allComplete =
    registroFichaEstudiantilCompletado &&
    registroFichaSocioeconomicaCompletado &&
    registroDatosFacturacionCompletado;

  return {
    registroFichaEstudiantilCompletado,
    registroFichaSocioeconomicaCompletado,
    registroDatosFacturacionCompletado,
    estadoRegistro: allComplete ? 'COMPLETO' : anyPhaseComplete ? 'INCOMPLETO' : 'PENDIENTE',
  };
}
