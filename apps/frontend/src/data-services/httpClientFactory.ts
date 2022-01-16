import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigService } from '../config/configService';
import { ConfigParam } from '../enums/config-params.enum';

const httpClientFactory = (configService: ConfigService): AxiosInstance => {
  const httpClient = axios.create({
    baseURL: configService.get<string>(ConfigParam.API_URL),
    timeout: 30000
  });

  const authHeaderInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const tokenFromLocalStorage = localStorage.getItem('token');

    if (tokenFromLocalStorage && config.headers) {
      config.headers['Authorization'] = `Bearer ${tokenFromLocalStorage}`;
    }

    return config;
  };

  httpClient.interceptors.request.use(authHeaderInterceptor);

  return httpClient;
};

export default httpClientFactory;
