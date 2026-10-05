import { CatalogosService } from './catalogos.service';

const createPrismaMock = () => ({
  pais: { findMany: jest.fn().mockResolvedValue([]) },
  provincia: { findMany: jest.fn().mockResolvedValue([]) },
  canton: { findMany: jest.fn().mockResolvedValue([]) },
  puebloNacionalidad: { findMany: jest.fn().mockResolvedValue([]) },
  sectorEconomico: { findMany: jest.fn().mockResolvedValue([]) },
  colegio: { findMany: jest.fn().mockResolvedValue([]) },
});

describe('CatalogosService', () => {
  it('returns the exact enum contract keys', async () => {
    const service = new CatalogosService(createPrismaMock() as never);
    const response = await service.getEnums();

    expect(Object.keys(response)).toEqual([
      'TipoDocumento',
      'Sexo',
      'Genero',
      'EstadoCivil',
      'Etnia',
      'TipoSangre',
      'Discapacidad',
      'TipoDiscapacidad',
      'TipoColegio',
      'ModalidadCarrera',
      'JornadaCarrera',
      'TipoMatricula',
      'NivelAcademico',
      'HaRepetidoAlMenosUnaMateria',
      'HaPerdidoLaGratuidad',
      'Paralelo',
      'RecibePensionDiferenciada',
      'EstudianteOcupacion',
      'IngresosEstudiante',
      'BonoDesarrollo',
      'HaRealizadoPracticasPreprofesionales',
      'EntornoInstitucionalPracticasProfesionales',
      'SectorEconomicoPracticaProfesional',
      'TipoBeca',
      'PrimeraRazonBeca',
      'SegundaRazonBeca',
      'TerceraRazonBeca',
      'CuartaRazonBeca',
      'QuintaRazonBeca',
      'SextaRazonBeca',
      'FinanciamientoBeca',
      'ParticipaEnProyectoVinculacionSociedad',
      'TipoAlcanceProyectoVinculacion',
      'NivelFormacionPadre',
      'NivelFormacionMadre',
      'DisenoCurricular',
      'Pais',
      'Provincia',
      'Canton',
      'PuebloNacionalidad',
    ]);
  });

  it('passes optional school filters without creating records', async () => {
    const prisma = createPrismaMock();
    const service = new CatalogosService(prisma as never);

    await service.getColegios('Pichincha', 'Quito');

    expect(prisma.colegio.findMany).toHaveBeenCalledWith({
      where: {
        provincia: { equals: 'Pichincha', mode: 'insensitive' },
        canton: { equals: 'Quito', mode: 'insensitive' },
      },
      orderBy: { nombre: 'asc' },
    });
  });
});
