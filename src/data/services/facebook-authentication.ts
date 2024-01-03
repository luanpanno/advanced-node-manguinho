import { FacebookApi } from '@/data/contracts/apis';
import { UserAccountRepository } from '@/data/contracts/repos';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models/facebook-account';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepo: UserAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);

    if (fbData) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      const fbAccount = new FacebookAccount(fbData, accountData);

      await this.userAccountRepo.saveWithFacebook(fbAccount);
    }

    return new AuthenticationError();
  }
}
