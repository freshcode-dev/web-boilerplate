import { App } from 'aws-cdk-lib';
import * as process from 'process';
import { VpcStack } from './stacks/vpc.stack';
import { MainStack, MainStackProps } from './stacks/main.stack';
import { EcrRepositoryStack } from './stacks/ecr-repository.stack';
import { ApplicationStage, getSettingsForStageByName } from './environments';
import { LoadBalancerStack } from './stacks/load-balancer.stack';
import { SesStack } from './stacks/ses.stack';

const {
	NX_CDK_DEFAULT_ACCOUNT: accountId = '[AWS ACCOUNT ID]',
	NX_CDK_DEFAULT_REGION: region = 'eu-north-1',
	NX_CDK_APP_NAME: applicationName = 'boilerplate',
	NX_CDK_STAGE: stage = 'test',
	NX_CDK_CERTIFICATE_ARN: certificateArn = undefined,
	NX_CDK_EMAIL_IDENTITY_DOMAIN: emailIdentityDomain = undefined,
	NX_CDK_DOCKER_IMAGE_TAG: dockerImageTag = undefined
} = process.env;


const stackPrefix = `${applicationName}-${stage}`;

const app = new App();

const env = {
	account: accountId,
	region,
};

const currentStageSettings = getSettingsForStageByName(stage as ApplicationStage);
const { vpc } = new VpcStack(app, `${stackPrefix}-vpc-stack`, { env });

new LoadBalancerStack(
	app,
	`${applicationName}-alb-stack`,
	applicationName,
	vpc,
	certificateArn,
	{
		env,
		terminationProtection: true,
		description: `Core application load balancer, used to route traffic to all the environments`
	}
);

// new SesStack(app,
// 	`${applicationName}-ses-stack`,
// 	applicationName,
// 	{
// 		env,
// 		emailIdentityDomain,
// 		terminationProtection: true,
// 		description: `Shared domain-based email identity`
// 	});

new EcrRepositoryStack(app, `${stackPrefix}-ecr-stack`, stackPrefix, { env });

const mainStackProps: MainStackProps = {
	stackPrefix,
	vpc,
	stageSettings: currentStageSettings,
	dockerImageTag,

	env
};

new MainStack(app, `${stackPrefix}-stack`, mainStackProps);

app.synth();
