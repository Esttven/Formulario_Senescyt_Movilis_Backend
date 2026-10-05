import { NotFoundException } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';

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

const createPrismaMock = () => {
  const prisma: any = {
    estudiante: {
      findMany: jest.fn().mockResolvedValue([record]),
      findUnique: jest.fn().mockImplementation(({ where }: any) => {
        if (where.tipoDocumento_numeroIdentificacion?.numeroIdentificacion === 'missing')
          return null;
        return record;
      }),
      findUniqueOrThrow: jest.fn().mockResolvedValue(record),
      create: jest.fn().mockResolvedValue({ id: record.id }),
      update: jest.fn().mockResolvedValue(record),
      delete: jest.fn().mockResolvedValue(record),
    },
    composicionFamiliar: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    ingresoFamiliar: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    pais: { findUnique: jest.fn().mockResolvedValue({ id: 'EC' }) },
    provincia: { findUnique: jest.fn().mockResolvedValue({ id: '17' }) },
    canton: { findUnique: jest.fn().mockResolvedValue({ id: '1701' }) },
    puebloNacionalidad: { findUnique: jest.fn().mockResolvedValue({ id: 'pueblo-kichwa' }) },
    sectorEconomico: { findUnique: jest.fn().mockResolvedValue({ id: 'sector-agricultura' }) },
    colegio: { findUnique: jest.fn().mockResolvedValue({ id: 'colegio-ejemplo-quito' }) },
  };
  prisma.$transaction = jest.fn(async (callback: (client: any) => unknown) => callback(prisma));
  return prisma;
};

describe('EstudiantesService', () => {
  it('creates an estudiante and returns the mapped response', async () => {
    const prisma = createPrismaMock();
    const service = new EstudiantesService(prisma);

    const response = await service.create({
      tipoDocumento: 'CEDULA',
      numeroIdentificacion: '1234567890',
      primerApellido: 'GARCIA',
      segundoApellido: 'NA',
      primerNombre: 'JUAN',
      segundoNombre: 'NA',
      sexo: 'HOMBRE',
      genero: 'MASCULINO',
      estadoCivil: 'SOLTERO',
      etnia: 'MESTIZO',
      tipoSangre: 'O_POSITIVO',
      discapacidad: 'NO',
      fechaNacimiento: '2000-01-01',
    });

    expect(prisma.estudiante.create).toHaveBeenCalled();
    expect(response.id).toBe(1);
    expect(response.Pais_Estudiante_paisNacionalidadIdToPais).toEqual({
      id: 'EC',
      codigo: 1,
      nombre: 'Ecuador',
    });
  });

  it('lists students with relations', async () => {
    const service = new EstudiantesService(createPrismaMock());
    const response = await service.findAll();

    expect(response).toHaveLength(1);
    expect(response[0].composicionFamiliar).toEqual([]);
  });

  it('gets one student and maps relations', async () => {
    const service = new EstudiantesService(createPrismaMock());
    const response = await service.findOne(1);

    expect(response.id).toBe(1);
    expect(response.Pais_Estudiante_paisNacionalidadIdToPais?.nombre).toBe('Ecuador');
  });

  it('rejects a missing student detail', async () => {
    const prisma = createPrismaMock();
    prisma.estudiante.findUnique.mockResolvedValueOnce(null);
    const service = new EstudiantesService(prisma);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a student partially', async () => {
    const prisma = createPrismaMock();
    const service = new EstudiantesService(prisma);
    const response = await service.update(1, { nombreColegioProcedencia: 'COLEGIO NUEVO' });

    expect(prisma.estudiante.update).toHaveBeenCalled();
    expect(response.id).toBe(1);
  });

  it('deletes a student after verifying existence', async () => {
    const prisma = createPrismaMock();
    const service = new EstudiantesService(prisma);

    await service.remove(1);

    expect(prisma.estudiante.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('finds an existing student and returns null for a missing document', async () => {
    const service = new EstudiantesService(createPrismaMock());

    await expect(service.findByDocument('CEDULA', '1234567890')).resolves.toMatchObject({ id: 1 });
    await expect(service.findByDocument('CEDULA', 'missing')).resolves.toBeNull();
  });

  it('saves phase 2 without clearing phase 1 or omitted child arrays', async () => {
    const prisma = createPrismaMock();
    const service = new EstudiantesService(prisma);

    const response = await service.guardarPaso({
      tipoDocumento: 'CEDULA',
      numeroIdentificacion: '1234567890',
      facturacionNombre: 'JUAN GARCIA',
      facturacionTipoIdentificacion: 'CEDULA',
      facturacionIdentificacion: '1234567890',
      facturacionDireccion: 'AV. PRINCIPAL',
      facturacionCorreo: 'juan@example.com',
      facturacionTelefono: '0999999999',
    });

    const updateData = prisma.estudiante.update.mock.calls[0][0].data;
    expect(updateData.facturacionNombre).toBe('JUAN GARCIA');
    expect(updateData.primerNombre).toBeUndefined();
    expect(updateData.primerApellido).toBeUndefined();
    expect(prisma.composicionFamiliar.deleteMany).not.toHaveBeenCalled();
    expect(prisma.ingresoFamiliar.deleteMany).not.toHaveBeenCalled();
    expect(response.registroDatosFacturacionCompletado).toBe(false);
  });
});
