import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

// Passamos a config (connectionString) e deixamos o adapter criar o Pool
// internamente. Passar uma instância de `pg.Pool` quebra aqui: o
// adapter usa `pool instanceof pg.Pool`, mas o `pg` importado como ESM no app
// e o `pg` requerido (CJS) pelo @prisma/adapter-pg são realms diferentes, então
// o instanceof dá false e o Pool é tratado como config, gerando o erro
// "string argument must be of type string ... Received an instance of Object".
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
