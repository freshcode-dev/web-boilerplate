import { AxiosInstance, AxiosResponse } from 'axios';
import { LoginDto, UserDto, UserFilter } from '@boilerplate/shared';

class UsersService {
  private readonly baseRoute = 'users';

  constructor(private readonly httpClient: AxiosInstance) {}

  public async getTestData(filters?: UserFilter): Promise<AxiosResponse<UserDto[]>> {
    return this.httpClient.get<UserDto[]>(this.baseRoute, { params: filters });
  }

	public async login(body: LoginDto): Promise<AxiosResponse<string>> {
		return this.httpClient.post<string>(`${this.baseRoute}/login`, body);
	}
}

export default UsersService;
