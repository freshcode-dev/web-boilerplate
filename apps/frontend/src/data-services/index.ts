import UsersService from './UsersService';
import httpClientFactory from './httpClientFactory';
import configService from '../config/configService';

export const httpClient = httpClientFactory(configService);

export const usersService = new UsersService(httpClient);
