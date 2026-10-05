import 'reflect-metadata';
import { Prisma } from '@prisma/client';
import { toEstudianteResponseDto, toPrismaEstudianteData } from './estudiante.mapper';

describe('EstudianteMapper', () => {
  it('maps partial HTTP values to Prisma-compatible values', () => {
    const result = toPrismaEstudianteData({
      tipoDocumento: 'CEDULA',
      numeroIdentificacion: '1234567890',
      montoBeca: '500.50' as never,
      ingresoTotalHogar: 'NA' as never,
      fechaNacimiento: '2000-01-02',
    });

    expect(result.tipoDocumento).toBe('CEDULA');
    expect(result.numeroIdentificacion).toBe('1234567890');
    expect(result.montoBeca).toEqual(new Prisma.Decimal('500.50'));
    expect(result.ingresoTotalHogar).toBeNull();
    expect(result.fechaNacimiento).toEqual(new Date('2000-01-02'));
  });

  it('returns contract relation names instead of Prisma relation names', () => {
    const result = toEstudianteResponseDto({
      id: 1,
      tipoDocumento: 'CEDULA',
      numeroIdentificacion: '1234567890',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      registroFichaEstudiantilCompletado: false,
      registroFichaSocioeconomicaCompletado: false,
      registroDatosFacturacionCompletado: false,
      estadoRegistro: 'PENDIENTE',
      paisNacionalidad: { id: 'EC', codigo: 1, nombre: 'Ecuador' },
      provinciaNacimiento: null,
      cantonNacimiento: null,
      composicionFamiliar: [],
      ingresosFamiliares: [],
      documentos: [],
    });

    expect(result.Pais_Estudiante_paisNacionalidadIdToPais).toEqual({
      id: 'EC',
      codigo: 1,
      nombre: 'Ecuador',
    });
    expect(result).not.toHaveProperty('paisNacionalidad');
  });
});
