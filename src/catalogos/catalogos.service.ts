import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ENUM_VALUES, EnumsResponse } from './catalogos.constants';

@Injectable()
export class CatalogosService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaises() {
    return this.prisma.pais.findMany({ orderBy: { nombre: 'asc' } });
  }

  async getProvincias(paisId?: string) {
    return this.prisma.provincia.findMany({
      where: paisId ? { paisId } : undefined,
      orderBy: { nombre: 'asc' },
    });
  }

  async getCantones(provinciaId?: string) {
    return this.prisma.canton.findMany({
      where: provinciaId ? { provinciaId } : undefined,
      orderBy: { nombre: 'asc' },
    });
  }

  async getPueblosYNacionalidades(tipo?: string) {
    return this.prisma.puebloNacionalidad.findMany({
      where: tipo ? { tipo } : undefined,
      orderBy: { nombre: 'asc' },
    });
  }

  async getSectoresEconomicos() {
    return this.prisma.sectorEconomico.findMany({ orderBy: { nombre: 'asc' } });
  }

  async getColegios(provincia?: string, canton?: string) {
    return this.prisma.colegio.findMany({
      where: {
        ...(provincia ? { provincia: { equals: provincia, mode: 'insensitive' } } : {}),
        ...(canton ? { canton: { equals: canton, mode: 'insensitive' } } : {}),
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async getEnums(): Promise<EnumsResponse> {
    const [paises, provincias, cantones, pueblosYNacionalidades] = await Promise.all([
      this.getPaises(),
      this.getProvincias(),
      this.getCantones(),
      this.getPueblosYNacionalidades(),
    ]);

    return {
      ...ENUM_VALUES,
      Pais: paises,
      Provincia: provincias,
      Canton: cantones,
      PuebloNacionalidad: pueblosYNacionalidades,
    };
  }
}
