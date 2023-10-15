import { FacebookApi } from '@/data/contracts/apis';
import { UserAccountRepository } from '@/data/contracts/repos';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

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
      const account = await this.userAccountRepo.load({ email: fbData.email });

      await this.userAccountRepo.saveWithFacebook({
        id: account?.id,
        name: account?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId,
      });
    }

    return new AuthenticationError();
  }
}
