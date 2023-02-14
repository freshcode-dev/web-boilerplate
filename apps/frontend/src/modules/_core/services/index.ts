import httpClientFactory from "apps/frontend/src/modules/_core/services/http-client.factory";
import configService from 'apps/frontend/src/modules/_core/services/config.service';

export const httpClientService = httpClientFactory(configService);
