import { LoadFacebookUser } from '@/domain/contracts/gateways';
import { TokenGenerator } from '@/domain/contracts/gateways/token';
import { UserAccountRepository } from '@/domain/contracts/repos';
import { AccessToken } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookAccount } from '@/domain/entities/facebook-account';

type Input = { token: string };

type Output = { accessToken: string };

export type FacebookAuthentication = (params: Input) => Promise<Output>;

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: UserAccountRepository,
  token: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebook, userAccountRepo, token) => async (params) => {
    const fbData = await facebook.loadUser(params);

    if (!fbData) {
      throw new AuthenticationError();
    }

    const accountData = await userAccountRepo.load({
      email: fbData.email,
    });
    const fbAccount = new FacebookAccount(fbData, accountData);
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount);
    const accessToken = await token.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return { accessToken };
  };
