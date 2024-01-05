import { FacebookApi } from '@/data/contracts/apis';
import { UserAccountRepository } from '@/data/contracts/repos';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models/facebook-account';

import { TokenGenerator } from '../contracts/crypto/token';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepo: UserAccountRepository,
    private readonly crypto: TokenGenerator,
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
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount);

      await this.crypto.generateToken({ key: id });
    }

    return new AuthenticationError();
  }
}
