import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ConfigService } from '../../_core/services/config.service';
import { IConfigParams } from '../../_core/interfaces/config-params';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../_core/constants';

const httpClientFactory = (configService: ConfigService<IConfigParams>): AxiosInstance => {
  const httpClient = axios.create({
    baseURL: configService.get('NX_APP_API_URL'),
    timeout: 30000
  });

  const authHeaderInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const tokenFromLocalStorage = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (tokenFromLocalStorage && config.headers) {
      config.headers['Authorization'] = `Bearer ${tokenFromLocalStorage}`;
    }

    return config;
  };

  httpClient.interceptors.request.use(authHeaderInterceptor);

  return httpClient;
};

export default httpClientFactory;
