import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ComposicionFamiliarDto, IngresoFamiliarDto } from './familia.dto';

const numericOrNull = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null || value === '' || value === 'NA' || value === 'NULL') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
};

export class EstudianteFieldsDto {
  @IsOptional() @IsString() tipoDocumento?: string;
  @IsOptional() @IsString() numeroIdentificacion?: string;
  @IsOptional() @IsString() @MaxLength(60) primerApellido?: string;
  @IsOptional() @IsString() @MaxLength(60) segundoApellido?: string;
  @IsOptional() @IsString() @MaxLength(60) primerNombre?: string;
  @IsOptional() @IsString() @MaxLength(60) segundoNombre?: string;
  @IsOptional() @IsString() sexo?: string;
  @IsOptional() @IsString() genero?: string;
  @IsOptional() @IsString() estadoCivil?: string;
  @IsOptional() @IsString() etnia?: string;
  @IsOptional() @IsString() tipoSangre?: string;

  @IsOptional() @IsString() discapacidad?: string;
  @IsOptional() @IsString() porcentajeDiscapacidad?: string | null;
  @IsOptional() @IsString() numCarnetConadis?: string | null;
  @IsOptional() @IsString() tipoDiscapacidad?: string | null;
  @IsOptional() @IsDateString() fechaNacimiento?: string;

  @IsOptional() @IsString() paisNacionalidadId?: string | null;
  @IsOptional() @IsString() provinciaNacimientoId?: string | null;
  @IsOptional() @IsString() cantonNacimientoId?: string | null;
  @IsOptional() @IsString() paisResidenciaId?: string | null;
  @IsOptional() @IsString() provinciaResidenciaId?: string | null;
  @IsOptional() @IsString() cantonResidenciaId?: string | null;
  @IsOptional() @IsString() nacionalidadId?: string | null;
  @IsOptional() @IsString() puebloId?: string | null;
  @IsOptional() @IsString() sectorEconomicoId?: string | null;

  @IsOptional() @IsString() tipoColegioId?: string | null;
  @IsOptional() @IsString() colegioProcedenciaId?: string | null;
  @IsOptional() @IsString() @MaxLength(200) nombreColegioProcedencia?: string | null;
  @IsOptional() @IsString() tituloBachiller?: string | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2200)
  anioGraduacion?: number | null;
  @IsOptional() @IsString() modalidadCarrera?: string | null;
  @IsOptional() @IsString() jornadaCarrera?: string | null;
  @IsOptional() @IsDateString() fechaInicioCarrera?: string | null;
  @IsOptional() @IsDateString() fechaMatricula?: string | null;
  @IsOptional() @IsString() tipoMatricula?: string | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(1)
  duracionPeriodoAcademico?: number | null;
  @IsOptional() @IsString() nivelAcademico?: string | null;
  @IsOptional() @IsString() haRepetidoAlMenosUnaMateria?: string | null;
  @IsOptional() @IsString() paralelo?: string | null;
  @IsOptional() @IsString() haPerdidoLaGratuidad?: string | null;
  @IsOptional() @IsString() recibePensionDiferenciada?: string | null;
  @IsOptional() @IsString() carrera?: string | null;
  @IsOptional() @IsString() disenoCurricular?: string | null;
  @IsOptional() @IsString() periodoAcademico?: string | null;

  @IsOptional() @IsString() estudianteOcupacion?: string | null;
  @IsOptional() @IsString() @MaxLength(200) trabajoEspecifique?: string | null;
  @IsOptional() @IsString() ingresosEstudiante?: string | null;
  @IsOptional() @IsString() bonoDesarrollo?: string | null;

  @IsOptional() @IsString() haRealizadoPracticasPreprofesionales?: string | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  nroHorasPracticasPreprofesionalesPorPeriodo?: number | null;
  @IsOptional() @IsString() entornoInstitucionalPracticasProfesionales?: string | null;
  @IsOptional() @IsString() sectorEconomicoPracticaProfesional?: string | null;

  @IsOptional() @IsString() tipoBeca?: string | null;
  @IsOptional() @IsString() primeraRazonBeca?: string | null;
  @IsOptional() @IsString() segundaRazonBeca?: string | null;
  @IsOptional() @IsString() terceraRazonBeca?: string | null;
  @IsOptional() @IsString() cuartaRazonBeca?: string | null;
  @IsOptional() @IsString() quintaRazonBeca?: string | null;
  @IsOptional() @IsString() sextaRazonBeca?: string | null;
  @Transform(({ value }) => numericOrNull({ value })) @IsOptional() @IsNumber() @Min(0) montoBeca?:
    number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeBecaCoberturaArancel?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeBecaCoberturaManutencion?: number | null;
  @IsOptional() @IsString() financiamientoBeca?: string | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  montoAyudaEconomica?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  montoCreditoEducativo?: number | null;
  @IsOptional() @IsBoolean() financiamientoFondosPropios?: boolean;
  @IsOptional() @IsBoolean() financiamientoAyudaPadres?: boolean;
  @IsOptional() @IsBoolean() financiamientoTarjetaCredito?: boolean;
  @IsOptional() @IsBoolean() financiamientoEntidadFinanciera?: boolean;
  @IsOptional() @IsBoolean() financiamientoTercerasPersonas?: boolean;
  @IsOptional() @IsString() @MaxLength(200) financiamientoQuienes?: string | null;

  @IsOptional() @IsString() participaEnProyectoVinculacionSociedad?: string | null;
  @IsOptional() @IsString() tipoAlcanceProyectoVinculacion?: string | null;

  @IsOptional() @IsString() correoElectronico?: string | null;
  @IsOptional() @IsString() correoInstitucional?: string | null;
  @IsOptional() @IsString() numeroCelular?: string | null;
  @IsOptional() @IsString() numeroConvencional?: string | null;
  @IsOptional() @IsString() direccionDomicilio?: string | null;
  @IsOptional() @IsString() lugarResidencia?: string | null;
  @IsOptional() @IsString() referenciaDomiciliaria?: string | null;
  @IsOptional() @IsString() parroquiaProcedencia?: string | null;
  @IsOptional() @IsString() parroquiaResidencia?: string | null;
  @IsOptional() @IsString() barrioSector?: string | null;
  @IsOptional() @IsString() paisProcedenciaExtranjero?: string | null;
  @IsOptional() @IsString() estadoProvinciaProcedencia?: string | null;
  @IsOptional() @IsString() cantonProcedencia?: string | null;
  @IsOptional() @IsString() barrioSectorProcedencia?: string | null;
  @IsOptional() @IsString() direccionDomicilioProcedencia?: string | null;

  @IsOptional() @IsString() alergias?: string | null;
  @IsOptional() @IsString() presentaAlergiaImportante?: string | null;
  @IsOptional() @IsString() medicamentos?: string | null;
  @IsOptional() @IsString() enfermedadCatastrofica?: string | null;
  @IsOptional() @IsString() presentaCarnetDiscapacidad?: string | null;
  @IsOptional() @IsString() referenciaPersonalNombre?: string | null;
  @IsOptional() @IsString() referenciaPersonalParentesco?: string | null;
  @IsOptional() @IsString() referenciaPersonalTelefono?: string | null;
  @IsOptional() @IsString() referenciaPersonalCorreo?: string | null;
  @IsOptional() @IsString() contactoEmergenciaNombre?: string | null;
  @IsOptional() @IsString() contactoEmergenciaParentesco?: string | null;
  @IsOptional() @IsString() contactoEmergenciaTelefono?: string | null;
  @IsOptional() @IsString() contactoEmergenciaCorreo?: string | null;

  @IsOptional() @IsString() nivelFormacionPadre?: string | null;
  @IsOptional() @IsString() nivelFormacionMadre?: string | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  ingresoTotalHogar?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(1)
  cantidadMiembrosHogar?: number | null;

  @IsOptional() @IsString() zonaVivienda?: string | null;
  @IsOptional() @IsString() coordenadasVivienda?: string | null;
  @IsOptional() @IsString() croquisViviendaUrl?: string | null;
  @IsOptional() @IsString() tipoPropiedadVivienda?: string | null;
  @IsOptional() @IsString() estructuraVivienda?: string | null;
  @IsOptional() @IsString() estructuraViviendaEspecifique?: string | null;
  @IsOptional() @IsString() tipoVivienda?: string | null;
  @IsOptional() @IsString() serviciosDisponibles?: string | null;
  @IsOptional() @IsBoolean() servicioEnergiaElectrica?: boolean | null;
  @IsOptional() @IsBoolean() servicioAguaPotable?: boolean | null;
  @IsOptional() @IsBoolean() servicioAlcantarillado?: boolean | null;
  @IsOptional() @IsBoolean() servicioTelefonoFijo?: boolean | null;
  @IsOptional() @IsBoolean() servicioInternet?: boolean | null;
  @IsOptional() @IsBoolean() servicioTvCable?: boolean | null;
  @IsOptional() @IsBoolean() servicioPlanDatos?: boolean | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadBanos?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadHabitaciones?: number | null;
  @IsOptional() @IsString() comparteHabitacion?: string | null;
  @IsOptional() @IsString() conQuienVive?: string | null;
  @IsOptional() @IsString() tamanoViviendaSuficiente?: string | null;

  @IsOptional() @IsString() dinamicaFamiliar?: string | null;
  @IsOptional() @IsString() violenciaFamiliar?: string | null;
  @IsOptional() @IsString() tipoViolenciaFamiliar?: string | null;
  @IsOptional() @IsString() estudianteCabezaFamiliar?: string | null;
  @IsOptional() @IsString() familiaDiscapacidadEnfermedadCatastrofica?: string | null;
  @IsOptional() @IsString() familiaProblemaSalud?: string | null;
  @IsOptional() @IsString() familiaParentesco?: string | null;
  @IsOptional() @IsString() familiaServiciosMedicos?: string | null;
  @IsOptional() @IsString() familiaServiciosMedicosDetalle?: string | null;

  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoVivienda?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoAlimentacion?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoEducacion?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoIndumentaria?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoTransporte?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoSalud?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoServiciosBasicos?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  egresoOtros?: number | null;
  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalEgresos?: number | null;

  @IsOptional() @IsString() tipoComprobante?: string | null;
  @IsOptional() @IsString() facturacionNombre?: string | null;
  @IsOptional() @IsString() facturacionTipoIdentificacion?: string | null;
  @IsOptional() @IsString() facturacionIdentificacion?: string | null;
  @IsOptional() @IsString() facturacionDireccion?: string | null;
  @IsOptional() @IsString() facturacionCorreo?: string | null;
  @IsOptional() @IsString() facturacionTelefono?: string | null;
  @IsOptional() @IsString() mantenerDatosFacturacion?: string | null;

  @IsOptional() @IsString() copiaCedula?: string | null;
  @IsOptional() @IsString() copiaPapeleta?: string | null;
  @IsOptional() @IsString() certificadoRegistroTitulo?: string | null;
  @IsOptional() @IsString() justificacionRetrasoDocumentos?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComposicionFamiliarDto)
  composicionFamiliar?: ComposicionFamiliarDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngresoFamiliarDto)
  ingresosFamiliares?: IngresoFamiliarDto[];
}

export class CreateEstudianteDto extends EstudianteFieldsDto {
  @IsString() tipoDocumento!: string;
  @IsString() numeroIdentificacion!: string;
  @IsString() primerApellido!: string;
  @IsString() segundoApellido!: string;
  @IsString() primerNombre!: string;
  @IsString() segundoNombre!: string;
  @IsString() sexo!: string;
  @IsString() genero!: string;
  @IsString() estadoCivil!: string;
  @IsString() etnia!: string;
  @IsString() tipoSangre!: string;
  @IsString() discapacidad!: string;
  @IsDateString() fechaNacimiento!: string;
}

export class UpdateEstudianteDto extends EstudianteFieldsDto {}

export class GuardarPasoDto extends EstudianteFieldsDto {
  @IsString() tipoDocumento!: string;
  @IsString() numeroIdentificacion!: string;
}

export class EstudianteRelationDto {
  id!: string;
  codigo!: number | null;
  nombre!: string;
}

export class EstudianteResponseDto extends EstudianteFieldsDto {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  registroFichaEstudiantilCompletado!: boolean;
  registroFichaSocioeconomicaCompletado!: boolean;
  registroDatosFacturacionCompletado!: boolean;
  estadoRegistro!: string;
  Pais_Estudiante_paisNacionalidadIdToPais?: EstudianteRelationDto | null;
  Pais_Estudiante_paisResidenciaIdToPais?: EstudianteRelationDto | null;
  Provincia_Estudiante_provinciaNacimientoIdToProvincia?: EstudianteRelationDto | null;
  Provincia_Estudiante_provinciaResidenciaIdToProvincia?: EstudianteRelationDto | null;
  Canton_Estudiante_cantonNacimientoIdToCanton?: EstudianteRelationDto | null;
  Canton_Estudiante_cantonResidenciaIdToCanton?: EstudianteRelationDto | null;
  documentos?: unknown[];
}

export { numericOrNull };
