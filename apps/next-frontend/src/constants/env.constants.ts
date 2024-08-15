import { StageNameEnum } from '.';

// Private (not avaliable in browser, only in server)

export const NODE_ENV = process.env.NODE_ENV as string;
export const INTERNAL_API_BASE_URL = process.env['INTERNAL_API_BASE_URL'] as string;

// Public (avaliable in browser and server)

export const SELF_DOMAIN = process.env['NEXT_PUBLIC_SELF_DOMAIN'] as string;

export const BACKEND_API_BASE_URL = process.env['NEXT_PUBLIC_BACKEND_API_BASE_URL'] as string;

export const STAGE_NAME_TO_DISPLAY: StageNameEnum = process.env['NEXT_PUBLIC_STAGE_NAME_TO_DISPLAY'] as StageNameEnum;

/* OAUTH ENV */

export const IS_GOOGLE_AUTH_ENABLED = process.env['NEXT_PUBLIC_ENABLE_GOOGLE_AUTH'] === 'true';
export const GOOGLE_API_CLIENT_ID = process.env['NEXT_PUBLIC_GOOGLE_API_CLIENT_ID'] as string;
