import { FacebookApi } from '@/domain/contracts/apis';
import { UserAccountRepository } from '@/domain/contracts/repos';
import { AccessToken } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookAccount } from '@/domain/entities/facebook-account';

import { TokenGenerator } from '../contracts/crypto/token';

type Input = { token: string };

type Output = { accessToken: string };

export type FacebookAuthentication = (params: Input) => Promise<Output>;

type Setup = (
  facebookApi: FacebookApi,
  userAccountRepo: UserAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepo, crypto) => async (params) => {
    const fbData = await facebookApi.loadUser(params);

    if (!fbData) {
      throw new AuthenticationError();
    }

    const accountData = await userAccountRepo.load({
      email: fbData.email,
    });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount);
    const accessToken = await crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return { accessToken };
  };
