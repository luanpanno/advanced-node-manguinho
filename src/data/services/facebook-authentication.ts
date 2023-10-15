import { LoadFacebookUserApi } from '@/data/contracts/apis';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '../contracts/repos';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createFacebookAccountRepo: CreateFacebookAccountRepository,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const data = await this.loadFacebookUserApi.loadUser(params);

    if (data) {
      await this.loadUserAccountRepo.load({ email: data.email });
      await this.createFacebookAccountRepo.createFromFacebook(data);
    }

    return new AuthenticationError();
  }
}
