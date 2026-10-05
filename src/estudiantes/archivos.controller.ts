import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ArchivosService } from './archivos.service';
import { ArchivoTipo } from './archivos.constants';
import { DeleteArchivoDto } from './dto/delete-archivo.dto';

@ApiTags('archivos')
@Controller('estudiantes')
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('upload-titulo-bachiller')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { archivo: { type: 'string', format: 'binary' }, estudianteId: { type: 'integer' } }, required: ['archivo'] } })
  @UseInterceptors(FileInterceptor('archivo'))
  uploadTitulo(
    @UploadedFile() file: Express.Multer.File,
    @Query('estudianteId') estudianteId?: string,
  ) {
    return this.upload('titulo-bachiller', file, estudianteId);
  }

  @Post('upload-croquis-vivienda')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { archivo: { type: 'string', format: 'binary' }, estudianteId: { type: 'integer' } }, required: ['archivo'] } })
  @UseInterceptors(FileInterceptor('archivo'))
  uploadCroquis(
    @UploadedFile() file: Express.Multer.File,
    @Query('estudianteId') estudianteId?: string,
  ) {
    return this.upload('croquis-vivienda', file, estudianteId);
  }

  @Post('upload-copia-cedula')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { archivo: { type: 'string', format: 'binary' }, estudianteId: { type: 'integer' } }, required: ['archivo'] } })
  @UseInterceptors(FileInterceptor('archivo'))
  uploadCedula(
    @UploadedFile() file: Express.Multer.File,
    @Query('estudianteId') estudianteId?: string,
  ) {
    return this.upload('copia-cedula', file, estudianteId);
  }

  @Post('upload-copia-papeleta')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { archivo: { type: 'string', format: 'binary' }, estudianteId: { type: 'integer' } }, required: ['archivo'] } })
  @UseInterceptors(FileInterceptor('archivo'))
  uploadPapeleta(
    @UploadedFile() file: Express.Multer.File,
    @Query('estudianteId') estudianteId?: string,
  ) {
    return this.upload('copia-papeleta', file, estudianteId);
  }

  @Post('upload-certificado-registro-titulo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { archivo: { type: 'string', format: 'binary' }, estudianteId: { type: 'integer' } }, required: ['archivo'] } })
  @UseInterceptors(FileInterceptor('archivo'))
  uploadCertificado(
    @UploadedFile() file: Express.Multer.File,
    @Query('estudianteId') estudianteId?: string,
  ) {
    return this.upload('certificado-registro-titulo', file, estudianteId);
  }

  @Post('delete-titulo-bachiller')
  @ApiBody({ type: DeleteArchivoDto })
  deleteTitulo(@Body() body: DeleteArchivoDto) {
    return this.archivosService.remove('titulo-bachiller', body);
  }
  @Post('delete-croquis-vivienda')
  @ApiBody({ type: DeleteArchivoDto })
  deleteCroquis(@Body() body: DeleteArchivoDto) {
    return this.archivosService.remove('croquis-vivienda', body);
  }
  @Post('delete-copia-cedula')
  @ApiBody({ type: DeleteArchivoDto })
  deleteCedula(@Body() body: DeleteArchivoDto) {
    return this.archivosService.remove('copia-cedula', body);
  }
  @Post('delete-copia-papeleta')
  @ApiBody({ type: DeleteArchivoDto })
  deletePapeleta(@Body() body: DeleteArchivoDto) {
    return this.archivosService.remove('copia-papeleta', body);
  }
  @Post('delete-certificado-registro-titulo')
  @ApiBody({ type: DeleteArchivoDto })
  deleteCertificado(@Body() body: DeleteArchivoDto) {
    return this.archivosService.remove('certificado-registro-titulo', body);
  }

  private upload(tipo: ArchivoTipo, file: Express.Multer.File, estudianteId?: string) {
    const parsedId = estudianteId === undefined ? undefined : Number(estudianteId);
    if (parsedId !== undefined && (!Number.isInteger(parsedId) || parsedId < 1)) {
      throw new BadRequestException('estudianteId inválido');
    }
    return this.archivosService.upload(tipo, file, parsedId);
  }
}
