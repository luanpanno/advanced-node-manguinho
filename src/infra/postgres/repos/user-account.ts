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
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await this.pgUserRepo.update(
        {
          id: +params.id,
        },
        {
          name: params.name,
          facebookId: params.facebookId,
        },
      );
    }

    return { id: '1' };
  }
}
