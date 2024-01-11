import { IMemoryDb, newDb } from 'pg-mem';

export const makeFakeDb = async (entities?: unknown[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'],
  });

  await connection.synchronize();

  return db;
};
