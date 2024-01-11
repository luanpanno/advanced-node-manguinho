import { IBackup, newDb } from 'pg-mem';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
  getConnection,
  getRepository,
} from 'typeorm';

import { LoadUserAccountRepository } from '@/data/contracts/repos';

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, name: 'nome' })
  name?: string;

  @Column()
  email!: string;

  @Column({ nullable: true, name: 'id_facebook' })
  facebookId?: string;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email: params.email });

    if (!pgUser?.id) return undefined;

    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeAll(async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });

      await connection.synchronize();

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
