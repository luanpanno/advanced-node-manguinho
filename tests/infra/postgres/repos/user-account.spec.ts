import { newDb } from 'pg-mem';
import { Column, Entity, PrimaryGeneratedColumn, getRepository } from 'typeorm';

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

const makeSut = () => {
  const sut = new PgUserAccountRepository();

  return {
    sut,
  };
};

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });

      await connection.synchronize();

      const pgUserRepo = getRepository(PgUser);

      await pgUserRepo.save({ email: 'existing_email' });

      const { sut } = makeSut();

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });

      await connection.close();
    });

    it('should return undefined if email does not exist', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });

      await connection.synchronize();

      const { sut } = makeSut();

      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });
});
