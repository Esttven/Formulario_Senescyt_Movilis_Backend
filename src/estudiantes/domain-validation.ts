import { BadRequestException } from '@nestjs/common';
import { EstudianteFieldsDto } from './dto';

const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== '' && value !== 'NA' && value !== 'NO_APLICA';

const isNoValue = (value: unknown): boolean =>
  value === undefined || value === null || value === '' || value === 'NA' || value === 'NO_APLICA';

const requirePresent = (value: unknown, message: string): void => {
  if (!isPresent(value)) throw new BadRequestException(message);
};

const requireNoValue = (value: unknown, message: string): void => {
  if (!isNoValue(value)) throw new BadRequestException(message);
};

const requireInteger = (value: unknown, message: string, minimum: number): void => {
  if (value === undefined || value === null) return;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < minimum) {
    throw new BadRequestException(message);
  }
};

const isIsoDate = (value: unknown): boolean => {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
};

export function validateEstudianteDomainRules(dto: EstudianteFieldsDto): void {
  if (dto.tipoDocumento !== undefined) {
    if (dto.tipoDocumento !== 'CEDULA' && dto.tipoDocumento !== 'PASAPORTE') {
      throw new BadRequestException('tipoDocumento debe ser CEDULA o PASAPORTE');
    }
    if (dto.numeroIdentificacion !== undefined) {
      const validLength = dto.tipoDocumento === 'CEDULA' ? /^\d{10}$/ : /^[A-Za-z0-9]{9}$/;
      if (!validLength.test(dto.numeroIdentificacion)) {
        throw new BadRequestException('numeroIdentificacion no corresponde al tipoDocumento');
      }
    }
  }

  for (const [field, value] of Object.entries({
    fechaNacimiento: dto.fechaNacimiento,
    fechaInicioCarrera: dto.fechaInicioCarrera,
    fechaMatricula: dto.fechaMatricula,
  })) {
    if (!isIsoDate(value))
      throw new BadRequestException(`${field} debe usar formato ISO yyyy-MM-dd`);
  }

  if (dto.discapacidad === 'SI') {
    requirePresent(
      dto.tipoDiscapacidad,
      'tipoDiscapacidad es obligatorio cuando discapacidad es SI',
    );
    requirePresent(
      dto.porcentajeDiscapacidad,
      'porcentajeDiscapacidad es obligatorio cuando discapacidad es SI',
    );
    requirePresent(
      dto.numCarnetConadis,
      'numCarnetConadis es obligatorio cuando discapacidad es SI',
    );
  } else if (dto.discapacidad !== undefined) {
    requireNoValue(
      dto.tipoDiscapacidad,
      'tipoDiscapacidad debe ser NA o null cuando discapacidad no es SI',
    );
    requireNoValue(
      dto.porcentajeDiscapacidad,
      'porcentajeDiscapacidad debe ser NA o null cuando discapacidad no es SI',
    );
    requireNoValue(
      dto.numCarnetConadis,
      'numCarnetConadis debe ser NA o null cuando discapacidad no es SI',
    );
  }

  if (dto.presentaAlergiaImportante !== undefined && dto.presentaAlergiaImportante !== 'SI') {
    requireNoValue(
      dto.alergias,
      'alergias debe ser NA, vacío o null cuando no presenta alergia importante',
    );
  }

  if (dto.haRealizadoPracticasPreprofesionales === 'SI') {
    requirePresent(
      dto.nroHorasPracticasPreprofesionalesPorPeriodo,
      'Las horas de prácticas son obligatorias cuando haRealizadoPracticasPreprofesionales es SI',
    );
    requirePresent(
      dto.entornoInstitucionalPracticasProfesionales,
      'El entorno de prácticas es obligatorio cuando haRealizadoPracticasPreprofesionales es SI',
    );
    requirePresent(
      dto.sectorEconomicoPracticaProfesional,
      'El sector de prácticas es obligatorio cuando haRealizadoPracticasPreprofesionales es SI',
    );
  } else if (dto.haRealizadoPracticasPreprofesionales !== undefined) {
    requireNoValue(
      dto.nroHorasPracticasPreprofesionalesPorPeriodo,
      'Las horas de prácticas deben ser NA o null cuando no se realizaron prácticas',
    );
    requireNoValue(
      dto.entornoInstitucionalPracticasProfesionales,
      'El entorno de prácticas debe ser NO_APLICA o null cuando no se realizaron prácticas',
    );
    requireNoValue(
      dto.sectorEconomicoPracticaProfesional,
      'El sector de prácticas debe ser NO_APLICA o null cuando no se realizaron prácticas',
    );
  }

  if (
    dto.participaEnProyectoVinculacionSociedad !== undefined &&
    dto.participaEnProyectoVinculacionSociedad !== 'SI'
  ) {
    requireNoValue(
      dto.tipoAlcanceProyectoVinculacion,
      'tipoAlcanceProyectoVinculacion debe ser NO_APLICA o null cuando no participa en vinculación',
    );
  }

  if (dto.etnia === 'INDIGENA') {
    if (!isPresent(dto.nacionalidadId) && !isPresent(dto.puebloId)) {
      throw new BadRequestException('nacionalidadId o puebloId es obligatorio para etnia INDIGENA');
    }
  } else if (dto.etnia !== undefined) {
    requireNoValue(dto.nacionalidadId, 'nacionalidadId debe ser NA o null para esta etnia');
    requireNoValue(dto.puebloId, 'puebloId debe ser NA o null para esta etnia');
  }

  if (dto.financiamientoTercerasPersonas === false) {
    requireNoValue(
      dto.financiamientoQuienes,
      'financiamientoQuienes debe ser NA o null si no hay terceras personas',
    );
  }

  requireInteger(dto.cantidadBanos, 'cantidadBanos debe ser un entero no negativo', 0);
  requireInteger(
    dto.cantidadHabitaciones,
    'cantidadHabitaciones debe ser un entero no negativo',
    0,
  );
  requireInteger(dto.cantidadMiembrosHogar, 'cantidadMiembrosHogar debe ser un entero positivo', 1);
  requireInteger(
    dto.nroHorasPracticasPreprofesionalesPorPeriodo,
    'nroHorasPracticasPreprofesionalesPorPeriodo debe ser un entero no negativo',
    0,
  );

  for (const [field, value] of Object.entries({
    porcentajeBecaCoberturaArancel: dto.porcentajeBecaCoberturaArancel,
    porcentajeBecaCoberturaManutencion: dto.porcentajeBecaCoberturaManutencion,
  })) {
    if (value !== undefined && value !== null && (value < 0 || value > 100)) {
      throw new BadRequestException(`${field} debe estar entre 0 y 100`);
    }
  }
}
