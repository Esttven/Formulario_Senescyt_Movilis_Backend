import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  ComposicionFamiliarDto,
  CreateEstudianteDto,
  EstudianteFieldsDto,
  GuardarPasoDto,
  IngresoFamiliarDto,
  UpdateEstudianteDto,
} from './dto';
import {
  toEstudianteResponseDto,
  toPrismaComposicionFamiliarData,
  toPrismaEstudianteData,
  toPrismaIngresoFamiliarData,
} from './mappers/estudiante.mapper';
import { ESTUDIANTE_INCLUDE } from './estudiantes.constants';
import { obtenerEstadoRegistro } from './registro-status';
import { validateEstudianteDomainRules } from './domain-validation';
import { ArchivosService } from './archivos.service';

@Injectable()
export class EstudiantesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly archivosService?: ArchivosService,
  ) {}

  async findAll() {
    const records = await this.prisma.estudiante.findMany({
      include: ESTUDIANTE_INCLUDE,
      orderBy: { id: 'desc' },
    });
    return records.map(toEstudianteResponseDto);
  }

  async findOne(id: number) {
    const record = await this.prisma.estudiante.findUnique({
      where: { id },
      include: ESTUDIANTE_INCLUDE,
    });
    if (!record) throw new NotFoundException(`Estudiante ${id} no encontrado`);
    return toEstudianteResponseDto(record);
  }

  async findByDocument(tipoDocumento: string, numeroIdentificacion: string) {
    const record = await this.prisma.estudiante.findUnique({
      where: { tipoDocumento_numeroIdentificacion: { tipoDocumento, numeroIdentificacion } },
      include: ESTUDIANTE_INCLUDE,
    });
    return record ? toEstudianteResponseDto(record) : null;
  }

  async create(dto: CreateEstudianteDto) {
    await this.validateForeignKeys(dto);
    validateEstudianteDomainRules(dto);
    try {
      const record = await this.prisma.$transaction(async (transaction) => {
        const estudiante = await transaction.estudiante.create({
          data: toPrismaEstudianteData(dto),
        });
        await this.replaceChildren(transaction, estudiante.id, dto);
        return transaction.estudiante.findUniqueOrThrow({
          where: { id: estudiante.id },
          include: ESTUDIANTE_INCLUDE,
        });
      });
      if (this.archivosService)
        await this.archivosService.syncStudentDocuments(
          record.id,
          dto as unknown as Record<string, unknown>,
        );
      return toEstudianteResponseDto(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: number, dto: UpdateEstudianteDto) {
    await this.ensureExists(id);
    await this.validateForeignKeys(dto);
    validateEstudianteDomainRules(dto);
    try {
      const record = await this.prisma.$transaction(async (transaction) => {
        const estudiante = await transaction.estudiante.update({
          where: { id },
          data: toPrismaEstudianteData(dto) as Prisma.EstudianteUncheckedUpdateInput,
        });
        await this.replaceChildren(transaction, estudiante.id, dto, false);
        return transaction.estudiante.findUniqueOrThrow({
          where: { id },
          include: ESTUDIANTE_INCLUDE,
        });
      });
      if (this.archivosService)
        await this.archivosService.syncStudentDocuments(record.id, dto as Record<string, unknown>);
      return toEstudianteResponseDto(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async guardarPaso(dto: GuardarPasoDto) {
    const normalized = this.normalizeGuardarPaso(dto);
    await this.validateForeignKeys(normalized);
    this.validateConditionalRules(normalized);

    try {
      const record = await this.prisma.$transaction(async (transaction) => {
        const existing = await transaction.estudiante.findUnique({
          where: {
            tipoDocumento_numeroIdentificacion: {
              tipoDocumento: normalized.tipoDocumento!,
              numeroIdentificacion: normalized.numeroIdentificacion!,
            },
          },
          select: { id: true },
        });

        const estudiante = existing
          ? await transaction.estudiante.update({
              where: { id: existing.id },
              data: toPrismaEstudianteData(normalized) as Prisma.EstudianteUncheckedUpdateInput,
            })
          : await transaction.estudiante.create({ data: toPrismaEstudianteData(normalized) });

        await this.replaceChildren(transaction, estudiante.id, normalized, !existing);

        const merged = await transaction.estudiante.findUniqueOrThrow({
          where: { id: estudiante.id },
          include: ESTUDIANTE_INCLUDE,
        });
        const status = obtenerEstadoRegistro(merged);

        await transaction.estudiante.update({
          where: { id: estudiante.id },
          data: status,
        });

        return transaction.estudiante.findUniqueOrThrow({
          where: { id: estudiante.id },
          include: ESTUDIANTE_INCLUDE,
        });
      });

      if (this.archivosService)
        await this.archivosService.syncStudentDocuments(
          record.id,
          normalized as unknown as Record<string, unknown>,
        );
      return toEstudianteResponseDto(record);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    try {
      await this.prisma.estudiante.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private async ensureExists(id: number): Promise<void> {
    const exists = await this.prisma.estudiante.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException(`Estudiante ${id} no encontrado`);
  }

  private normalizeGuardarPaso(dto: GuardarPasoDto): GuardarPasoDto {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' && value.trim() === '') continue;
      normalized[key] = value;
    }
    return normalized as unknown as GuardarPasoDto;
  }

  private validateConditionalRules(dto: EstudianteFieldsDto): void {
    validateEstudianteDomainRules(dto);
  }

  private async replaceChildren(
    transaction: Prisma.TransactionClient,
    estudianteId: number,
    dto: EstudianteFieldsDto,
    createMode = true,
  ): Promise<void> {
    if (dto.composicionFamiliar !== undefined) {
      if (!createMode)
        await transaction.composicionFamiliar.deleteMany({ where: { estudianteId } });
      if (dto.composicionFamiliar.length > 0) {
        await transaction.composicionFamiliar.createMany({
          data: dto.composicionFamiliar.map((row) => ({
            ...toPrismaComposicionFamiliarData(row as ComposicionFamiliarDto),
            estudianteId,
          })),
        });
      }
    }

    if (dto.ingresosFamiliares !== undefined) {
      if (!createMode) await transaction.ingresoFamiliar.deleteMany({ where: { estudianteId } });
      if (dto.ingresosFamiliares.length > 0) {
        await transaction.ingresoFamiliar.createMany({
          data: dto.ingresosFamiliares.map((row) => ({
            ...toPrismaIngresoFamiliarData(row as IngresoFamiliarDto),
            estudianteId,
          })),
        });
      }
    }
  }

  private async validateForeignKeys(dto: EstudianteFieldsDto): Promise<void> {
    const checks: Array<Promise<void>> = [];
    this.addForeignKeyCheck(checks, dto.paisNacionalidadId, 'país de nacionalidad', () =>
      this.prisma.pais.findUnique({ where: { id: dto.paisNacionalidadId! }, select: { id: true } }),
    );
    this.addForeignKeyCheck(checks, dto.paisResidenciaId, 'país de residencia', () =>
      this.prisma.pais.findUnique({ where: { id: dto.paisResidenciaId! }, select: { id: true } }),
    );
    this.addForeignKeyCheck(checks, dto.provinciaNacimientoId, 'provincia de nacimiento', () =>
      this.prisma.provincia.findUnique({
        where: { id: dto.provinciaNacimientoId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.provinciaResidenciaId, 'provincia de residencia', () =>
      this.prisma.provincia.findUnique({
        where: { id: dto.provinciaResidenciaId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.cantonNacimientoId, 'cantón de nacimiento', () =>
      this.prisma.canton.findUnique({
        where: { id: dto.cantonNacimientoId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.cantonResidenciaId, 'cantón de residencia', () =>
      this.prisma.canton.findUnique({
        where: { id: dto.cantonResidenciaId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.nacionalidadId, 'nacionalidad', () =>
      this.prisma.puebloNacionalidad.findUnique({
        where: { id: dto.nacionalidadId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.puebloId, 'pueblo', () =>
      this.prisma.puebloNacionalidad.findUnique({
        where: { id: dto.puebloId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.sectorEconomicoId, 'sector económico', () =>
      this.prisma.sectorEconomico.findUnique({
        where: { id: dto.sectorEconomicoId! },
        select: { id: true },
      }),
    );
    this.addForeignKeyCheck(checks, dto.colegioProcedenciaId, 'colegio de procedencia', () =>
      this.prisma.colegio.findUnique({
        where: { id: dto.colegioProcedenciaId! },
        select: { id: true },
      }),
    );
    await Promise.all(checks);
  }

  private addForeignKeyCheck(
    checks: Array<Promise<void>>,
    id: string | null | undefined,
    label: string,
    lookup: () => Promise<{ id: string } | null>,
  ): void {
    if (id === undefined || id === null || id === '' || id === 'NA') return;
    checks.push(
      lookup().then((result) => {
        if (!result) throw new BadRequestException(`${label} ${id} no existe`);
      }),
    );
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        throw new ConflictException('Ya existe un estudiante con esa identificación');
      if (error.code === 'P2003')
        throw new BadRequestException('Una relación de catálogo no existe');
      if (error.code === 'P2025') throw new NotFoundException('Registro no encontrado');
    }
    throw error;
  }
}
