import { PrismaClient } from '@prisma/client';
import {
  CANTONES,
  PAISES,
  PROVINCIAS,
  PUEBLOS_NACIONALIDADES,
  SECTORES_ECONOMICOS,
  parse,
} from './catalogos-senescyt';

const prisma = new PrismaClient();

const row = ({ codigo, nombre }: { codigo: string; nombre: string }) => ({
  id: codigo,
  codigo: Number(codigo),
  nombre,
});

async function main(): Promise<void> {
  // Ids reales = códigos oficiales (el admin los envía tal cual al SENESCYT).
  // Ids de la semilla anterior (stub) se eliminan; ponytail: falla si algún estudiante los referencia.
  const upsert = (model: any, data: any) =>
    model.upsert({ where: { id: data.id }, update: data, create: data });

  for (const p of parse(PAISES)) await upsert(prisma.pais, row(p));
  for (const p of parse(PROVINCIAS)) await upsert(prisma.provincia, { ...row(p), paisId: '56' });
  for (const c of parse(CANTONES)) {
    await upsert(prisma.canton, { ...row(c), provinciaId: c.codigo.slice(0, 2) });
  }
  for (const p of parse(PUEBLOS_NACIONALIDADES)) {
    await upsert(prisma.puebloNacionalidad, {
      ...row(p),
      tipo: Number(p.codigo) <= 14 ? 'nacionalidad' : 'pueblo',
    });
  }
  for (const s of parse(SECTORES_ECONOMICOS)) await upsert(prisma.sectorEconomico, row(s));

  const ids = (raw: string) => ({ notIn: parse(raw).map((c) => c.codigo) });
  await prisma.canton.deleteMany({ where: { id: ids(CANTONES) } });
  await prisma.provincia.deleteMany({ where: { id: ids(PROVINCIAS) } });
  await prisma.pais.deleteMany({ where: { id: ids(PAISES) } });
  await prisma.puebloNacionalidad.deleteMany({ where: { id: ids(PUEBLOS_NACIONALIDADES) } });
  await prisma.sectorEconomico.deleteMany({ where: { id: ids(SECTORES_ECONOMICOS) } });

}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
