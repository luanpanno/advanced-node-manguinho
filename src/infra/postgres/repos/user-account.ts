import { getRepository } from 'typeorm';

import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos';

import { PgUser } from '../entities';

export class PgUserAccountRepository
  implements LoadUserAccount, SaveFacebookAccount
{
  async load({
    email,
  }: LoadUserAccount.Params): Promise<LoadUserAccount.Result> {
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
  }: SaveFacebookAccount.Params): Promise<SaveFacebookAccount.Result> {
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
  }: SaveFacebookAccount.Params) {
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
  }: SaveFacebookAccount.Params) {
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
