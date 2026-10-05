import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class DeleteArchivoDto {
  @IsString()
  @IsUrl({ require_tld: false })
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  estudianteId?: number;
}
