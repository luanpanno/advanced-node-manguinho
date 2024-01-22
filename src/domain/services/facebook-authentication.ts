import { FacebookApi } from '@/domain/contracts/apis';
import { UserAccountRepository } from '@/domain/contracts/repos';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { FacebookAccount } from '@/domain/models/facebook-account';

import { TokenGenerator } from '../contracts/crypto/token';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly userAccountRepo: UserAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params);

    if (!fbData) {
      return new AuthenticationError();
    }

    const accountData = await this.userAccountRepo.load({
      email: fbData.email,
    });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount);
    const token = await this.crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return new AccessToken(token);
  }
}
