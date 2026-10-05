import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { STORAGE_SERVICE } from '../src/storage';

const record = {
  id: 1,
  tipoDocumento: 'CEDULA',
  numeroIdentificacion: '1234567890',
  primerApellido: 'GARCIA',
  primerNombre: 'JUAN',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  registroFichaEstudiantilCompletado: false,
  registroFichaSocioeconomicaCompletado: false,
  registroDatosFacturacionCompletado: false,
  estadoRegistro: 'PENDIENTE',
  paisNacionalidad: { id: 'EC', codigo: 1, nombre: 'Ecuador' },
  paisResidencia: null,
  provinciaNacimiento: null,
  provinciaResidencia: null,
  cantonNacimiento: null,
  cantonResidencia: null,
  composicionFamiliar: [],
  ingresosFamiliares: [],
  documentos: [],
};

const prismaMock: any = {
  estudiante: {
    findMany: jest.fn().mockResolvedValue([record]),
    findUnique: jest.fn().mockImplementation(({ where }: any) => {
      if (where.tipoDocumento_numeroIdentificacion?.numeroIdentificacion === 'missing') return null;
      return record;
    }),
    findUniqueOrThrow: jest.fn().mockResolvedValue(record),
    create: jest.fn().mockResolvedValue({ id: 1 }),
    update: jest.fn().mockResolvedValue(record),
    delete: jest.fn().mockResolvedValue(record),
  },
  composicionFamiliar: { deleteMany: jest.fn(), createMany: jest.fn() },
  ingresoFamiliar: { deleteMany: jest.fn(), createMany: jest.fn() },
  documento: { findFirst: jest.fn().mockResolvedValue(null), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pais: { findUnique: jest.fn().mockResolvedValue({ id: 'EC' }) },
  provincia: { findUnique: jest.fn().mockResolvedValue({ id: '17' }) },
  canton: { findUnique: jest.fn().mockResolvedValue({ id: '1701' }) },
  puebloNacionalidad: { findUnique: jest.fn().mockResolvedValue({ id: 'pueblo-kichwa' }) },
  sectorEconomico: { findUnique: jest.fn().mockResolvedValue({ id: 'sector-agricultura' }) },
  colegio: { findUnique: jest.fn().mockResolvedValue({ id: 'colegio-ejemplo-quito' }) },
};
prismaMock.$transaction = jest.fn(async (callback: (client: any) => unknown) =>
  callback(prismaMock),
);

const storageMock = {
  store: jest.fn().mockResolvedValue({
    url: 'http://localhost:3008/uploads/titulo/test.pdf',
    key: 'uploads/titulo/test.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 3,
  }),
  remove: jest.fn().mockResolvedValue(undefined),
  isManagedUrl: jest.fn().mockReturnValue(true),
};

describe('Estudiantes CRUD endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideProvider(STORAGE_SERVICE)
      .useValue(storageMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/estudiantes returns a list', async () => {
    const response = await request(app.getHttpServer()).get('/api/estudiantes').expect(200);
    expect(response.body).toHaveLength(1);
  });

  it('GET /api/estudiantes/:id returns relations and child arrays', async () => {
    const response = await request(app.getHttpServer()).get('/api/estudiantes/1').expect(200);
    expect(response.body.Pais_Estudiante_paisNacionalidadIdToPais.nombre).toBe('Ecuador');
    expect(response.body.composicionFamiliar).toEqual([]);
    expect(response.body.ingresosFamiliares).toEqual([]);
  });

  it('GET /api/estudiantes/buscar supports existing and missing documents', async () => {
    await request(app.getHttpServer())
      .get('/api/estudiantes/buscar?tipoDocumento=CEDULA&numeroIdentificacion=1234567890')
      .expect(200)
      .expect(({ body }) => expect(body.id).toBe(1));
    await request(app.getHttpServer())
      .get('/api/estudiantes/buscar?tipoDocumento=CEDULA&numeroIdentificacion=missing')
      .expect(200)
      .expect(({ body }) => expect(body).toBeNull());
  });

  it('POST /api/estudiantes creates a student', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/estudiantes')
      .send({ tipoDocumento: 'CEDULA', numeroIdentificacion: '1234567890' })
      .expect(201);
    expect(response.body.id).toBe(1);
  });

  it('PUT /api/estudiantes/:id updates a student partially', async () => {
    await request(app.getHttpServer())
      .put('/api/estudiantes/1')
      .send({ nombreColegioProcedencia: 'COLEGIO NUEVO' })
      .expect(200);
  });

  it('DELETE /api/estudiantes/:id returns 204', async () => {
    await request(app.getHttpServer()).delete('/api/estudiantes/1').expect(204);
  });

  it('POST /api/estudiantes/guardar-paso returns the complete record and phase status', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/estudiantes/guardar-paso')
      .send({
        tipoDocumento: 'CEDULA',
        numeroIdentificacion: '1234567890',
        facturacionNombre: 'JUAN GARCIA',
      })
      .expect(200);

    expect(response.body).toHaveProperty('registroFichaEstudiantilCompletado');
    expect(response.body).toHaveProperty('registroFichaSocioeconomicaCompletado');
    expect(response.body).toHaveProperty('registroDatosFacturacionCompletado');
    expect(response.body).toHaveProperty('estadoRegistro');
  });

  it('POST /api/estudiantes/guardar-paso persists family arrays and preserves omitted phase-one data', async () => {
    await request(app.getHttpServer())
      .post('/api/estudiantes/guardar-paso')
      .send({
        tipoDocumento: 'CEDULA',
        numeroIdentificacion: '1234567890',
        composicionFamiliar: [{ nombresApellidos: 'MARIA GARCIA', parentesco: 'MADRE' }],
        ingresosFamiliares: [{ nombresApellidos: 'MARIA GARCIA', ingresoMensual: 500, ingresosExtras: 0 }],
      })
      .expect(200);

    expect(prismaMock.composicionFamiliar.createMany).toHaveBeenCalled();
    expect(prismaMock.ingresoFamiliar.createMany).toHaveBeenCalled();
  });

  it('uploads and deletes a document through the multipart endpoints', async () => {
    await request(app.getHttpServer())
      .post('/api/estudiantes/upload-titulo-bachiller?estudianteId=1')
      .attach('archivo', Buffer.from('pdf'), { filename: 'titulo.pdf', contentType: 'application/pdf' })
      .expect(201)
      .expect(({ body }) => expect(body).toEqual({ url: 'http://localhost:3008/uploads/titulo/test.pdf' }));

    prismaMock.documento.findFirst.mockResolvedValueOnce({ id: 8, estudianteId: 1, url: 'http://localhost:3008/uploads/titulo/test.pdf', tipo: 'TITULO_BACHILLER' });
    await request(app.getHttpServer())
      .post('/api/estudiantes/delete-titulo-bachiller')
      .send({ url: 'http://localhost:3008/uploads/titulo/test.pdf' })
      .expect(201)
      .expect(({ body }) => expect(body).toEqual({ ok: true }));
    expect(storageMock.remove).toHaveBeenCalledWith('http://localhost:3008/uploads/titulo/test.pdf');
  });
});
