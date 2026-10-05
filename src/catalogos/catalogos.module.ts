import { Module } from '@nestjs/common';
import { CatalogosController, EnumsController } from './catalogos.controller';
import { CatalogosService } from './catalogos.service';

@Module({
  controllers: [CatalogosController, EnumsController],
  providers: [CatalogosService],
  exports: [CatalogosService],
})
export class CatalogosModule {}
