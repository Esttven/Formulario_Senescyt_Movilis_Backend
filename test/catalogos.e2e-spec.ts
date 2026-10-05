import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

const prismaMock = {
  pais: { findMany: jest.fn().mockResolvedValue([{ id: 'EC', codigo: 1, nombre: 'Ecuador' }]) },
  provincia: { findMany: jest.fn().mockResolvedValue([]) },
  canton: { findMany: jest.fn().mockResolvedValue([]) },
  puebloNacionalidad: { findMany: jest.fn().mockResolvedValue([]) },
  sectorEconomico: { findMany: jest.fn().mockResolvedValue([]) },
  colegio: { findMany: jest.fn().mockResolvedValue([]) },
};

describe('Catalogos endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/estudiantes/enums returns the contract shape', async () => {
    const response = await request(app.getHttpServer()).get('/api/estudiantes/enums').expect(200);

    expect(response.body).toHaveProperty('TipoDocumento');
    expect(response.body).toHaveProperty('Pais');
    expect(response.body).toHaveProperty('Provincia');
    expect(response.body).toHaveProperty('Canton');
    expect(response.body).toHaveProperty('PuebloNacionalidad');
    expect(response.body.TipoDocumento).toEqual(['CEDULA', 'PASAPORTE']);
    expect(response.body.Pais).toEqual([{ id: 'EC', codigo: 1, nombre: 'Ecuador' }]);
  });

  it.each([
    '/api/paises',
    '/api/provincias',
    '/api/provincias?paisId=EC',
    '/api/cantones',
    '/api/cantones?provinciaId=17',
    '/api/pueblos-nacionalidades',
    '/api/pueblos-nacionalidades?tipo=pueblo',
    '/api/sectores-economicos',
    '/api/colegios',
    '/api/colegios?provincia=Pichincha&canton=Quito',
  ])('%s responds with an array', async (endpoint) => {
    const response = await request(app.getHttpServer()).get(endpoint).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
