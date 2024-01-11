import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';

import { PgUser } from '../entities';

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  private readonly pgUserRepo = getRepository(PgUser);

  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email });

    if (!pgUser?.id) return undefined;

    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<SaveFacebookAccountRepository.Result> {
    if (!params.id) {
      const account = await this.saveUser(params);

      return { id: account.id.toString() };
    }

    await this.updateUser(params);

    return { id: params.id };
  }

  private async saveUser(params: SaveFacebookAccountRepository.Params) {
    return this.pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId,
    });
  }

  private async updateUser(params: SaveFacebookAccountRepository.Params) {
    return this.pgUserRepo.update(
      {
        id: +params.id!,
      },
      {
        name: params.name,
        facebookId: params.facebookId,
      },
    );
  }
}
