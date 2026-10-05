import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CatalogosService } from './catalogos.service';

@ApiTags('catalogos')
@Controller()
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('paises')
  @ApiOperation({ summary: 'List countries' })
  getPaises() {
    return this.catalogosService.getPaises();
  }

  @Get('provincias')
  @ApiOperation({ summary: 'List provinces, optionally filtered by country' })
  @ApiQuery({ name: 'paisId', required: false })
  getProvincias(@Query('paisId') paisId?: string) {
    return this.catalogosService.getProvincias(paisId);
  }

  @Get('cantones')
  @ApiOperation({ summary: 'List cantons, optionally filtered by province' })
  @ApiQuery({ name: 'provinciaId', required: false })
  getCantones(@Query('provinciaId') provinciaId?: string) {
    return this.catalogosService.getCantones(provinciaId);
  }

  @Get('pueblos-nacionalidades')
  @ApiOperation({ summary: 'List peoples and nationalities' })
  @ApiQuery({ name: 'tipo', required: false, enum: ['nacionalidad', 'pueblo'] })
  getPueblosYNacionalidades(@Query('tipo') tipo?: string) {
    return this.catalogosService.getPueblosYNacionalidades(tipo);
  }

  @Get('sectores-economicos')
  @ApiOperation({ summary: 'List economic sectors' })
  getSectoresEconomicos() {
    return this.catalogosService.getSectoresEconomicos();
  }

  @Get('colegios')
  @ApiOperation({ summary: 'List schools, optionally filtered by province and canton' })
  @ApiQuery({ name: 'provincia', required: false })
  @ApiQuery({ name: 'canton', required: false })
  getColegios(@Query('provincia') provincia?: string, @Query('canton') canton?: string) {
    return this.catalogosService.getColegios(provincia, canton);
  }
}

@ApiTags('estudiantes')
@Controller('estudiantes')
export class EnumsController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('enums')
  @ApiOperation({ summary: 'Return all form enum values and catalog collections' })
  getEnums() {
    return this.catalogosService.getEnums();
  }
}
