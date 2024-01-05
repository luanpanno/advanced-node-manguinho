import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApi } from '@/data/contracts/apis';
import { TokenGenerator } from '@/data/contracts/crypto/token';
import { UserAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';

import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookAccount } from '@/domain/models/facebook-account';

type Sut = {
  sut: FacebookAuthenticationService;
  facebookApi: MockProxy<FacebookApi>;
  crypto: MockProxy<TokenGenerator>;
  userAccountRepo: MockProxy<UserAccountRepository>;
};

const makeSut = (): Sut => {
  const facebookApi = mock<FacebookApi>();
  facebookApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  });
  const userAccountRepo = mock<UserAccountRepository>();
  userAccountRepo.load.mockResolvedValue(undefined);
  userAccountRepo.saveWithFacebook.mockResolvedValueOnce({
    id: 'any_account_id',
  });
  const crypto = mock<TokenGenerator>();
  crypto.generateToken.mockResolvedValue('any_generated_token');
  const sut = new FacebookAuthenticationService(
    facebookApi,
    userAccountRepo,
    crypto,
  );

  return {
    sut,
    facebookApi,
    userAccountRepo,
    crypto,
  };
};

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthenticationService', () => {
  const token = 'any_token';
  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  };

  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, facebookApi } = makeSut();

    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, facebookApi } = makeSut();
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    const { sut, userAccountRepo } = makeSut();

    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: fbData.email,
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const { sut, userAccountRepo } = makeSut();
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({
      any: 'any',
    }));

    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    const { sut, crypto } = makeSut();

    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const { sut } = makeSut();
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });
});
