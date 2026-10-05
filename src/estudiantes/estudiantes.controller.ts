import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateEstudianteDto, GuardarPasoDto, UpdateEstudianteDto } from './dto';
import { EstudiantesService } from './estudiantes.service';

@ApiTags('estudiantes')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  @ApiOperation({ summary: 'List students' })
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Post('guardar-paso')
  @HttpCode(200)
  @ApiBody({ type: GuardarPasoDto })
  @ApiOperation({ summary: 'Create or partially update a student step' })
  guardarPaso(@Body() dto: GuardarPasoDto) {
    return this.estudiantesService.guardarPaso(dto);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Find a student by document' })
  @ApiQuery({ name: 'tipoDocumento', required: true })
  @ApiQuery({ name: 'numeroIdentificacion', required: true })
  findByDocument(
    @Query('tipoDocumento') tipoDocumento: string,
    @Query('numeroIdentificacion') numeroIdentificacion: string,
    @Res() response: Response,
  ) {
    return this.estudiantesService
      .findByDocument(tipoDocumento, numeroIdentificacion)
      .then((student) => response.status(200).json(student));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one student with relations' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateEstudianteDto })
  @ApiOperation({ summary: 'Create a student' })
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateEstudianteDto })
  @ApiOperation({ summary: 'Partially update a student' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstudianteDto) {
    return this.estudiantesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a student' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.estudiantesService.remove(id);
  }
}
