import httpClientFactory from "./http-client.factory";
import configService from './config.service';

export const httpClientService = httpClientFactory(configService);
