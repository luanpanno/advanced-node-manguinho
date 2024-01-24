import { FacebookApi } from '@/domain/contracts/apis';
import { UserAccountRepository } from '@/domain/contracts/repos';
import { AccessToken } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookAccount } from '@/domain/entities/facebook-account';

import { TokenGenerator } from '../contracts/crypto/token';

export type FacebookAuthentication = (params: {
  token: string;
}) => Promise<AccessToken | AuthenticationError>;

type Setup = (
  facebookApi: FacebookApi,
  userAccountRepo: UserAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepo, crypto) => async (params) => {
    const fbData = await facebookApi.loadUser(params);

    if (!fbData) {
      return new AuthenticationError();
    }

    const accountData = await userAccountRepo.load({
      email: fbData.email,
    });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount);
    const token = await crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return new AccessToken(token);
  };
