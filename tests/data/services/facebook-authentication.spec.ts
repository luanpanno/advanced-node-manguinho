import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';

import { AuthenticationError } from '@/domain/errors';

type Sut = {
  sut: FacebookAuthenticationService;
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  loadUserAccountRepo: MockProxy<LoadUserAccountRepository>;
  createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>;
};

const makeSut = (): Sut => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>();
  loadFacebookUserApi.loadUser.mockResolvedValue({
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  });
  const loadUserAccountRepo = mock<LoadUserAccountRepository>();
  const createFacebookAccountRepo = mock<CreateFacebookAccountRepository>();
  const sut = new FacebookAuthenticationService(
    loadFacebookUserApi,
    loadUserAccountRepo,
    createFacebookAccountRepo,
  );

  return {
    sut,
    loadFacebookUserApi,
    loadUserAccountRepo,
    createFacebookAccountRepo,
  };
};

describe('FacebookAuthenticationService', () => {
  const token = 'any_token';
  const name = 'any_fb_name';
  const email = 'any_fb_email';
  const facebookId = 'any_fb_id';

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

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    const { sut, loadUserAccountRepo } = makeSut();

    await sut.perform({ token });

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({
      email,
    });
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepo returns undefined', async () => {
    const { sut, loadUserAccountRepo, createFacebookAccountRepo } = makeSut();

    loadUserAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name,
      email,
      facebookId,
    });
    expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(
      1,
    );
  });
});
