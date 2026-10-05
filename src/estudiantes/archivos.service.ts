import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { STORAGE_SERVICE, StoredFile, StorageService } from '../storage';
import { ARCHIVO_CONFIG, ArchivoTipo } from './archivos.constants';
import { DeleteArchivoDto } from './dto/delete-archivo.dto';

@Injectable()
export class ArchivosService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  async upload(
    tipo: ArchivoTipo,
    file: Express.Multer.File,
    estudianteId?: number,
  ): Promise<{ url: string }> {
    const config = ARCHIVO_CONFIG[tipo];
    this.validateFile(file, config.allowedMime, config.allowedExtensions, config.maxBytes);
    if (estudianteId !== undefined) await this.ensureStudent(estudianteId);

    const stored = await this.storage.store(file, config.folder);
    try {
      if (estudianteId !== undefined) {
        await this.attachToStudent(estudianteId, tipo, stored);
      }
      return { url: stored.url };
    } catch (error) {
      await this.storage.remove(stored.key);
      throw error;
    }
  }

  async remove(tipo: ArchivoTipo, dto: DeleteArchivoDto): Promise<{ ok: true }> {
    const config = ARCHIVO_CONFIG[tipo];
    const document = await this.prisma.documento.findFirst({
      where: { url: dto.url, tipo: config.documentType },
    });

    if (document && dto.estudianteId !== undefined && document.estudianteId !== dto.estudianteId) {
      throw new NotFoundException('El archivo no pertenece al estudiante indicado');
    }
    if (!document && !this.storage.isManagedUrl(dto.url)) {
      throw new NotFoundException('Archivo no encontrado o no administrado por este backend');
    }

    await this.storage.remove(dto.url);
    if (document) {
      await this.prisma.$transaction(async (transaction) => {
        await transaction.documento.delete({ where: { id: document.id } });
        await transaction.estudiante.update({
          where: { id: document.estudianteId },
          data: { [config.field]: null },
        });
      });
    }
    return { ok: true };
  }

  async syncStudentDocuments(estudianteId: number, values: Record<string, unknown>): Promise<void> {
    for (const config of Object.values(ARCHIVO_CONFIG)) {
      const url = values[config.field];
      if (typeof url !== 'string' || !url || url === 'NA') continue;
      const existing = await this.prisma.documento.findFirst({
        where: { estudianteId, tipo: config.documentType },
      });
      if (existing?.url === url) continue;
      if (existing) {
        await this.prisma.documento.update({ where: { id: existing.id }, data: { url } });
      } else {
        await this.prisma.documento.create({
          data: { estudianteId, tipo: config.documentType, url },
        });
      }
    }
  }

  private async attachToStudent(
    estudianteId: number,
    tipo: ArchivoTipo,
    stored: StoredFile,
  ): Promise<void> {
    const config = ARCHIVO_CONFIG[tipo];
    await this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.documento.findFirst({
        where: { estudianteId, tipo: config.documentType },
      });
      if (existing) await transaction.documento.delete({ where: { id: existing.id } });
      await transaction.documento.create({
        data: {
          estudianteId,
          tipo: config.documentType,
          url: stored.url,
          storageKey: stored.key,
          mimeType: stored.mimeType,
          sizeBytes: stored.sizeBytes,
        },
      });
      await transaction.estudiante.update({
        where: { id: estudianteId },
        data: { [config.field]: stored.url },
      });
    });
  }

  private async ensureStudent(estudianteId: number): Promise<void> {
    const student = await this.prisma.estudiante.findUnique({
      where: { id: estudianteId },
      select: { id: true },
    });
    if (!student) throw new NotFoundException(`Estudiante ${estudianteId} no encontrado`);
  }

  private validateFile(
    file: Express.Multer.File | undefined,
    allowedMime: string[],
    allowedExtensions: string[],
    maxBytes: number,
  ): void {
    if (!file) throw new BadRequestException('El campo multipart debe llamarse archivo');
    const extension = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()
      : '';
    if (!allowedMime.includes(file.mimetype) || !allowedExtensions.includes(extension)) {
      throw new BadRequestException('Tipo MIME o extensión de archivo no permitidos');
    }
    if (file.size > maxBytes)
      throw new BadRequestException('El archivo supera el tamaño máximo permitido');
  }
}
