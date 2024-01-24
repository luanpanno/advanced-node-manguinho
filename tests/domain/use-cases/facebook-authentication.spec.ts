import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto/token';
import { UserAccountRepository } from '@/domain/contracts/repos';
import { AccessToken } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookAccount } from '@/domain/entities/facebook-account';
import {
  setupFacebookAuthentication,
  FacebookAuthentication,
} from '@/domain/use-cases';

type Sut = {
  sut: FacebookAuthentication;
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
  userAccountRepo.saveWithFacebook.mockResolvedValue({
    id: 'any_account_id',
  });
  const crypto = mock<TokenGenerator>();
  crypto.generateToken.mockResolvedValue('any_generated_token');
  const sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);

  return {
    sut,
    facebookApi,
    userAccountRepo,
    crypto,
  };
};

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
  const token = 'any_token';
  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  };

  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, facebookApi } = makeSut();

    await sut({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, facebookApi } = makeSut();
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    const { sut, userAccountRepo } = makeSut();

    await sut({ token });

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

    await sut({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    const { sut, crypto } = makeSut();

    await sut({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const { sut } = makeSut();
    const authResult = await sut({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('should rethrow if an LoadFacebookUserApi throws', async () => {
    const { sut, facebookApi } = makeSut();
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('fb_error'));
  });

  it('should rethrow if an LoadUserAccountRepository throws', async () => {
    const { sut, userAccountRepo } = makeSut();
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('load_error'));
  });

  it('should rethrow if an SaveFacebookAccountRepository throws', async () => {
    const { sut, userAccountRepo } = makeSut();
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(
      new Error('save_error'),
    );
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('save_error'));
  });

  it('should rethrow if an TokenGenerator throws', async () => {
    const { sut, crypto } = makeSut();
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));
    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
