import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';

import { PgUser } from '../entities';

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);

    if (!params.id) {
      await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await pgUserRepo.update(
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
