export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<void>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result = undefined;
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params,
  ) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    name: string;
    email: string;
    facebookId: string;
  };

  export type Result = void;
}