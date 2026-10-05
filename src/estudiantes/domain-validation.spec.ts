import 'reflect-metadata';
import { validateEstudianteDomainRules } from './domain-validation';

const valid = (overrides: Record<string, unknown> = {}) =>
  ({
    tipoDocumento: 'CEDULA',
    numeroIdentificacion: '1234567890',
    fechaNacimiento: '2000-01-01',
    discapacidad: 'NO',
    presentaAlergiaImportante: 'NO',
    haRealizadoPracticasPreprofesionales: 'NO',
    participaEnProyectoVinculacionSociedad: 'NO',
    etnia: 'MESTIZO',
    financiamientoTercerasPersonas: false,
    cantidadBanos: 1,
    cantidadHabitaciones: 2,
    cantidadMiembrosHogar: 3,
    porcentajeBecaCoberturaArancel: 50,
    porcentajeBecaCoberturaManutencion: 25,
    ...overrides,
  }) as any;

describe('validateEstudianteDomainRules', () => {
  it.each([
    ['discapacidad', { discapacidad: 'NO', tipoDiscapacidad: 'FISICA' }],
    ['alergias', { presentaAlergiaImportante: 'NO', alergias: 'POLEN' }],
    [
      'practicas',
      {
        haRealizadoPracticasPreprofesionales: 'NO',
        entornoInstitucionalPracticasProfesionales: 'PRIVADA',
      },
    ],
    [
      'vinculacion',
      { participaEnProyectoVinculacionSociedad: 'NO', tipoAlcanceProyectoVinculacion: 'NACIONAL' },
    ],
    ['etnia', { etnia: 'MESTIZO', puebloId: 'pueblo-kichwa' }],
    ['financiamiento', { financiamientoTercerasPersonas: false, financiamientoQuienes: 'PADRES' }],
  ])('rejects inconsistent %s data', (_rule, overrides) => {
    expect(() => validateEstudianteDomainRules(valid(overrides))).toThrow();
  });

  it('requires disability fields when disability is SI', () => {
    expect(() => validateEstudianteDomainRules(valid({ discapacidad: 'SI' }))).toThrow();
    expect(() =>
      validateEstudianteDomainRules(
        valid({
          discapacidad: 'SI',
          tipoDiscapacidad: 'FISICA',
          porcentajeDiscapacidad: '40',
          numCarnetConadis: '123',
        }),
      ),
    ).not.toThrow();
  });

  it('requires practice fields when practices are SI', () => {
    expect(() =>
      validateEstudianteDomainRules(valid({ haRealizadoPracticasPreprofesionales: 'SI' })),
    ).toThrow();
    expect(() =>
      validateEstudianteDomainRules(
        valid({
          haRealizadoPracticasPreprofesionales: 'SI',
          nroHorasPracticasPreprofesionalesPorPeriodo: 100,
          entornoInstitucionalPracticasProfesionales: 'PRIVADA',
          sectorEconomicoPracticaProfesional: 'INDUSTRIAS_MANUFACTURERAS',
        }),
      ),
    ).not.toThrow();
  });

  it('requires a pueblo or nationality for indigenous ethnicity and accepts NA otherwise', () => {
    expect(() => validateEstudianteDomainRules(valid({ etnia: 'INDIGENA' }))).toThrow();
    expect(() =>
      validateEstudianteDomainRules(
        valid({ etnia: 'MESTIZO', puebloId: 'NA', nacionalidadId: 'NA' }),
      ),
    ).not.toThrow();
  });

  it('allows null location components for a foreign country', () => {
    expect(() =>
      validateEstudianteDomainRules({
        ...valid(),
        paisResidenciaId: 'US',
        provinciaResidenciaId: null,
        cantonResidenciaId: null,
      }),
    ).not.toThrow();
  });

  it('accepts a new school name without a catalog relation', () => {
    expect(() =>
      validateEstudianteDomainRules(
        valid({ tipoColegioId: 'EXTRANJERO', nombreColegioProcedencia: 'COLEGIO NUEVO' }),
      ),
    ).not.toThrow();
  });

  it.each([
    { cantidadBanos: 1.5 },
    { cantidadHabitaciones: -1 },
    { cantidadMiembrosHogar: 0 },
    { porcentajeBecaCoberturaArancel: 101 },
    { porcentajeBecaCoberturaManutencion: -1 },
  ])('rejects invalid numeric constraint %j', (override) => {
    expect(() => validateEstudianteDomainRules(valid(override))).toThrow();
  });

  it('requires ISO dates and a matching document number', () => {
    expect(() => validateEstudianteDomainRules(valid({ fechaNacimiento: '01/01/2000' }))).toThrow();
    expect(() =>
      validateEstudianteDomainRules(
        valid({ tipoDocumento: 'CEDULA', numeroIdentificacion: 'ABC' }),
      ),
    ).toThrow();
    expect(() =>
      validateEstudianteDomainRules(
        valid({ tipoDocumento: 'PASAPORTE', numeroIdentificacion: 'AB1234567' }),
      ),
    ).not.toThrow();
  });
});
