import { makeAutoObservable } from 'mobx';
import UsersService from '../data-services/UsersService';
import { LoginDto } from '@boilerplate/shared';

export class SessionStore {
  private accessToken: string | null = null;

  constructor(private readonly usersService: UsersService) {
    makeAutoObservable(this);
  }

  public get isAuthenticated() {
    return !!this.accessToken;
  }

  public login = async (loginData: LoginDto): Promise<void> => {
    const { data } = await this.usersService.login(loginData);

    await this.setToken(data);
  }

  public logOut = async (): Promise<void> => {
    await this.setToken(null);
  }

  public clearToken = (): void => {
    localStorage.removeItem("token");
    this.accessToken = null;
  }

  private readonly setToken = async (token: string | null): Promise<void> => {
    if (token) {
      localStorage.setItem("token", token);
      this.accessToken = token;
    } else {
      this.clearToken();
    }
  }
}
