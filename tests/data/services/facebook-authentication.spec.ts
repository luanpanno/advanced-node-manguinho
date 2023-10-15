import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApi } from '@/data/contracts/apis';
import { UserAccountRepository } from '@/data/contracts/repos';
import { FacebookAuthenticationService } from '@/data/services';

import { AuthenticationError } from '@/domain/errors';

type Sut = {
  sut: FacebookAuthenticationService;
  facebookApi: MockProxy<FacebookApi>;
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
  const sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);

  return {
    sut,
    facebookApi,
    userAccountRepo,
  };
};

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

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    const { sut, userAccountRepo } = makeSut();

    await sut.perform({ token });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(fbData);
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    const { sut, userAccountRepo } = makeSut();

    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: fbData.facebookId,
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update account name', async () => {
    const { sut, userAccountRepo } = makeSut();

    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
    });

    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: fbData.name,
      facebookId: fbData.facebookId,
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
