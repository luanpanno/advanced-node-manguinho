import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';

import { AuthenticationError } from '@/domain/errors';

type Sut = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
};

const makeSut = (): Sut => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>();
  loadFacebookUserApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  });
  const loadUserAccountRepo = mock<LoadUserAccountRepository>();
  const sut = new FacebookAuthenticationService(
    loadFacebookUserApi,
    loadUserAccountRepo
  );

  return {
    sut,
    loadFacebookUserApi,
    loadUserAccountRepo,
  };
};

describe('FacebookAuthenticationService', () => {
  const token = 'any_token';
  const email = 'any_fb_email';

  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut();

    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut();
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    const { sut, loadUserAccountRepo } = makeSut();
    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email,
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });
});
