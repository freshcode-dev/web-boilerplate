import { ApplicationStage, ICdkEnvironmentSettings } from './types';
import { cdkTestingEnvironmentSettings } from './cdk-testing.environment';

export * from './types';

export const getSettingsForStageByName = (stage: ApplicationStage): ICdkEnvironmentSettings => {
	switch (stage) {
		case 'cdk-testing':
			return cdkTestingEnvironmentSettings;
		default:
			return cdkTestingEnvironmentSettings;
	}
};
