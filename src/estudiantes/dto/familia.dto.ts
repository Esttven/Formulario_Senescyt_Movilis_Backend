import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

const numericOrNull = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null || value === '' || value === 'NA' || value === 'NULL') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
};

export class ComposicionFamiliarDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  estudianteId?: number;

  @IsString()
  @MaxLength(200)
  nombresApellidos!: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  cedulaIdentidad?: string | null;

  @IsOptional()
  @IsString()
  estadoCivil?: string | null;

  @IsOptional()
  @IsString()
  parentesco?: string | null;

  @IsOptional()
  @IsString()
  nivelEstudios?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  titulo?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  laborOcupacion?: string | null;
}

export class IngresoFamiliarDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  estudianteId?: number;

  @IsString()
  @MaxLength(200)
  nombresApellidos!: string;

  @IsOptional()
  @IsString()
  parentesco?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  actividadLaboral?: string | null;

  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  ingresoMensual?: number | null;

  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  ingresosExtras?: number | null;

  @Transform(({ value }) => numericOrNull({ value }))
  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number | null;
}
