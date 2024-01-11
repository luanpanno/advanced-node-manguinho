import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import { Repository, getConnection, getRepository } from 'typeorm';

import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repos/user-account';

const makeFakeDb = async (entities?: unknown[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'],
  });

  await connection.synchronize();

  return db;
};

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser]);

      backup = db.backup();

      pgUserRepo = getRepository(PgUser);
    });

    beforeEach(() => {
      backup.restore();
      sut = new PgUserAccountRepository();
    });

    afterAll(async () => {
      await getConnection().close();
    });

    it('should return an account if email exists', async () => {
      const email = 'existing_email';

      await pgUserRepo.save({ email });

      const account = await sut.load({ email });

      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });
});
