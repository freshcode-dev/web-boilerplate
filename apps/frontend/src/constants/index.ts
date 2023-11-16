import { configService } from '../modules/_core';

export * from './routes.constants';

export const googleApiClientId = configService.get('NX_GOOGLE_API_CLIENT_ID') as string;
export const isGoogleAuthEnabled = configService.get('NX_ENABLE_GOOGLE_AUTH') === 'true';
