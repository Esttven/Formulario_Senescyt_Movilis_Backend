import { NotFoundException } from '@nestjs/common';
import { ArchivosService } from './archivos.service';

const file = (overrides: Partial<Express.Multer.File> = {}) =>
  ({
    fieldname: 'archivo',
    originalname: 'documento.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    size: 4,
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from('test'),
    stream: undefined,
    ...overrides,
  }) as Express.Multer.File;

const createPrismaMock = () => {
  const prisma: any = {
    estudiante: {
      findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
    },
    documento: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 1 }),
      update: jest.fn().mockResolvedValue({ id: 1 }),
      delete: jest.fn().mockResolvedValue({ id: 1 }),
    },
  };
  prisma.$transaction = jest.fn(async (callback: (client: any) => unknown) => callback(prisma));
  return prisma;
};

const createStorageMock = () => ({
  store: jest.fn().mockResolvedValue({
    url: 'http://localhost:3008/uploads/titulo/file.pdf',
    key: 'uploads/titulo/file.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4,
  }),
  remove: jest.fn().mockResolvedValue(undefined),
  isManagedUrl: jest.fn().mockReturnValue(true),
});

describe('ArchivosService', () => {
  it('stores a valid title file and returns its URL', async () => {
    const prisma = createPrismaMock();
    const storage = createStorageMock();
    const service = new ArchivosService(prisma, storage);

    await expect(service.upload('titulo-bachiller', file())).resolves.toEqual({
      url: 'http://localhost:3008/uploads/titulo/file.pdf',
    });
    expect(storage.store).toHaveBeenCalled();
    expect(prisma.documento.create).not.toHaveBeenCalled();
  });

  it.each([
    { mimetype: 'text/plain', originalname: 'documento.txt' },
    { mimetype: 'application/pdf', originalname: 'documento.exe' },
    { mimetype: 'application/pdf', originalname: 'documento.pdf', size: 20 * 1024 * 1024 },
  ])('rejects invalid file metadata %j', async (overrides) => {
    const service = new ArchivosService(createPrismaMock(), createStorageMock());
    await expect(service.upload('titulo-bachiller', file(overrides))).rejects.toThrow();
  });

  it('attaches an upload to a student when estudianteId is provided', async () => {
    const prisma = createPrismaMock();
    const storage = createStorageMock();
    const service = new ArchivosService(prisma, storage);

    await service.upload('copia-cedula', file(), 1);

    expect(prisma.documento.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ estudianteId: 1, tipo: 'COPIA_CEDULA' }),
    });
    expect(prisma.estudiante.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { copiaCedula: 'http://localhost:3008/uploads/titulo/file.pdf' },
    });
  });

  it('deletes an associated document and clears its student URL', async () => {
    const prisma = createPrismaMock();
    prisma.documento.findFirst.mockResolvedValue({
      id: 9,
      estudianteId: 1,
      url: 'http://localhost:3008/uploads/titulo/file.pdf',
      tipo: 'TITULO_BACHILLER',
    });
    const storage = createStorageMock();
    const service = new ArchivosService(prisma, storage);

    await expect(
      service.remove('titulo-bachiller', { url: 'http://localhost:3008/uploads/titulo/file.pdf' }),
    ).resolves.toEqual({ ok: true });
    expect(storage.remove).toHaveBeenCalledWith('http://localhost:3008/uploads/titulo/file.pdf');
    expect(prisma.documento.delete).toHaveBeenCalledWith({ where: { id: 9 } });
  });

  it('rejects deleting a URL outside managed storage', async () => {
    const prisma = createPrismaMock();
    const storage = createStorageMock();
    storage.isManagedUrl.mockReturnValue(false);
    const service = new ArchivosService(prisma, storage);

    await expect(
      service.remove('copia-cedula', { url: 'https://other.example/file.pdf' }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(storage.remove).not.toHaveBeenCalled();
  });
});
