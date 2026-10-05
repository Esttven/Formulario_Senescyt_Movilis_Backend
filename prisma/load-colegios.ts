import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const json = JSON.parse(readFileSync(resolve(__dirname, '../../anexo6_colegios.json'), 'utf8'));
  const data = json.tables[0].rows.map((r: any) => ({
    id: String(r.id),
    codigo: r.id,
    nombre: r.nombre_institucion,
    provincia: r.provincia,
    canton: r.canton,
    sostenimiento: r.sostenimiento,
  }));
  for (let i = 0; i < data.length; i += 1000) {
    await prisma.colegio.createMany({ data: data.slice(i, i + 1000), skipDuplicates: true });
  }
  console.log('colegios en BD:', await prisma.colegio.count());
}

main().finally(() => prisma.$disconnect());
