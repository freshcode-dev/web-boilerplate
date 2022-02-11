import httpClientFactory from "./http-client.factory";
import configService from '../config/config.service';
import UsersService from './users.service';


export const httpClient = httpClientFactory(configService);

export const usersService = new UsersService(httpClient);
