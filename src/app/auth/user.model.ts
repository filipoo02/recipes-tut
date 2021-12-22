interface UserProps {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: Date;
}

export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  static buildUser(attrs: UserProps): User {
    return new User(
      attrs.email,
      attrs.id,
      attrs._token,
      attrs._tokenExpirationDate
    );
  }

  get token() {
    if (!this._tokenExpirationDate || this._tokenExpirationDate < new Date())
      return null;

    return this._token;
  }
}
