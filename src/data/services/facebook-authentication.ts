import { FacebookApi } from '@/data/contracts/apis';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

import { UserAccountRepository } from '../contracts/repos';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepo: UserAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const data = await this.facebookApi.loadUser(params);

    if (data) {
      await this.userAccountRepo.load({ email: data.email });
      await this.userAccountRepo.createFromFacebook(data);
    }

    return new AuthenticationError();
  }
}
