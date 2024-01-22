import { FacebookAccount } from '@/domain/entities/facebook-account';

describe('FacebookAccount', () => {
  it('should create with facebook data only', () => {
    const fbData = {
      name: 'john doe',
      email: 'john@doe.com',
      facebookId: 'any_fb_id',
    };
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual(fbData);
  });

  it('should update name if its empty', () => {
    const fbData = {
      name: 'john doe',
      email: 'john@doe.com',
      facebookId: 'any_fb_id',
    };
    const accountData = {
      id: 'any_id',
    };
    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: accountData.id,
      name: fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId,
    });
  });

  it('should not update name if its not empty', () => {
    const fbData = {
      name: 'john doe',
      email: 'john@doe.com',
      facebookId: 'any_fb_id',
    };
    const accountData = {
      id: 'any_id',
      name: 'any_name',
    };
    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: accountData.id,
      name: accountData.name,
      email: fbData.email,
      facebookId: fbData.facebookId,
    });
  });
});
