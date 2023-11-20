import { App } from 'aws-cdk-lib';
import * as process from 'process';
import { MainStack, MainStackProps } from './stacks/main.stack';
import { EcrRepositoryStack } from './stacks/ecr-repository.stack';
import { ApplicationStage, getSettingsForStageByName } from './environments';
import { LoadBalancerStack } from './stacks/load-balancer.stack';
import { getStacksTags } from './utils/tags-generation.utils';
import { SesStack } from './stacks/ses.stack';

const {
	NX_CDK_DEFAULT_ACCOUNT: accountId = '[AWS ACCOUNT ID]',
	NX_CDK_DEFAULT_REGION: region = 'eu-north-1',
	NX_CDK_APP_NAME: applicationName = 'boilerplate',
	NX_CDK_STAGE: stage = 'test',
	NX_CDK_CERTIFICATE_ARN: certificateArn = undefined,
	NX_CDK_DOCKER_IMAGE_TAG: dockerImageTag = undefined,
	NX_CDK_DEPLOYMENT_REPOSITORY_URL: deploymentRepositoryUrl = 'local',
	NX_CDK_EMAIL_IDENTITY_DOMAIN: emailIdentityDomain = undefined,
} = process.env;


const stackPrefix = `${applicationName}-${stage}`;
const {
	shared: sharedAppTags,
	stageBased: stageBasedTags
} = getStacksTags(applicationName, stage, deploymentRepositoryUrl);

const app = new App();

const env = {
	account: accountId,
	region,
};

const currentStageSettings = getSettingsForStageByName(stage as ApplicationStage);

/**
 * ⚠️ For most environments, having a single load balancer stack is enough, so it's not tied to
 * stage but only to application. If your cloud already has a shared load balancer, consider using it instead
 */
new LoadBalancerStack(
	app,
	`${applicationName}-alb-stack`,
	applicationName,
	certificateArn,
	{
		env,
		terminationProtection: true,
		description: `Core application load balancer, used to route traffic to all the environments`,
		tags: sharedAppTags
	}
);

new SesStack(app,
	`${stackPrefix}-ses-stack`,
	applicationName,
	{
		env,
		emailIdentityDomain,
		terminationProtection: true,
		description: `Shared domain-based email identity`
	});

/**
 * Most of the ECR-related resources are defined in a separate stack, so the pipeline can be split
 * into 2 different parts. It gives us a flexibility to easily push docker images from the outside of
 * CDK, and only depend on docker API instead of CDK's wrapper methods
 */
new EcrRepositoryStack(app, `${stackPrefix}-ecr-stack`, stackPrefix, { env, tags: stageBasedTags });

const mainStackProps: MainStackProps = {
	stackPrefix,
	stageSettings: currentStageSettings,
	dockerImageTag,

	env,
	tags: stageBasedTags
};

new MainStack(app, `${stackPrefix}-stack`, mainStackProps);

app.synth();
