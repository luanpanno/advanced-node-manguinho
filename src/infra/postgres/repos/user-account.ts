import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/domain/contracts/repos';

import { PgUser } from '../entities';

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  async load({
    email,
  }: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email });

    if (!pgUser?.id) return undefined;

    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }

  async saveWithFacebook({
    id,
    name,
    email,
    facebookId,
  }: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    if (!id) {
      const account = await this.saveUser({ email, name, facebookId });

      return { id: account.id.toString() };
    }

    await this.updateUser({ email, facebookId, name, id });

    return { id };
  }

  private async saveUser({
    email,
    name,
    facebookId,
  }: SaveFacebookAccountRepository.Params) {
    const pgUserRepo = getRepository(PgUser);

    return pgUserRepo.save({
      email,
      name,
      facebookId,
    });
  }

  private async updateUser({
    id,
    name,
    facebookId,
  }: SaveFacebookAccountRepository.Params) {
    const pgUserRepo = getRepository(PgUser);

    return pgUserRepo.update(
      {
        id: +id!,
      },
      {
        name: name,
        facebookId: facebookId,
      },
    );
  }
}
