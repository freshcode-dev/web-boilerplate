import { App } from 'aws-cdk-lib';
import * as process from 'process';
import { VpcStack } from './stacks/vpc.stack';
import { MainStack, MainStackProps } from './stacks/main.stack';
import { EcrRepositoryStack } from './stacks/ecr-repository.stack';

const {
	NX_CDK_DEFAULT_ACCOUNT: accountId = '[AWS ACCOUNT ID]',
	NX_CDK_DEFAULT_REGION: region = 'us-east-2',
	NX_APP_NAME: applicationName = 'boilerplate',
	NX_CDK_STAGE: stage = 'dev',
	NX_DATABASE_ENABLE_PERFORMANCE_INSIGHTS: enableDbPerformanceInsightsRaw = 'false',
	NX_MAINTAINERS_EMAILS: maintainersEmailsRaw = '[]'
} = process.env;

const maintainersEmails = JSON.parse(maintainersEmailsRaw) || [];
const enableDbPerformanceInsights = enableDbPerformanceInsightsRaw === 'true';

const stackPrefix = `${applicationName}-${stage}`;

const app = new App();

const env = {
	account: accountId,
	region: region,
};

const { vpc } = new VpcStack(app, `${stackPrefix}-vpc-stack`, { env });

const ecrStack = new EcrRepositoryStack(app, `${stackPrefix}-ecr-stack`, stackPrefix, { env });

const mainStackOptions: MainStackProps = {
	stackPrefix,
	vpc,
	enablePerformanceInsights: enableDbPerformanceInsights,
	maintainersEmails
};

const mainStack = new MainStack(app, `${stackPrefix}-stack`, mainStackOptions, { env });

app.synth();
