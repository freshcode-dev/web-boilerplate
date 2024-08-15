import { RouteDefinition } from '@/modules/_core/types';
import { AuthModuleRouter } from '@/modules/auth';
import { ProfileModuleRouter } from '@/modules/profile';

export const RouteDefinitions: RouteDefinition[] = [
	...AuthModuleRouter,
	...ProfileModuleRouter
];
