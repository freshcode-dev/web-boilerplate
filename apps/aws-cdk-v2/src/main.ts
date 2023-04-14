import { App } from 'aws-cdk-lib';
import * as process from 'process';
import { VpcStack } from 'apps/aws-cdk-v2/src/stacks/vpc.stack';
import { MainStack } from 'apps/aws-cdk-v2/src/stacks/main.stack';
import { EcrRepositoryStack } from 'apps/aws-cdk-v2/src/stacks/ecr-repository.stack';

const {
	NX_CDK_DEFAULT_ACCOUNT: accountId = '[AWS ACCOUNT ID]',
	NX_CDK_DEFAULT_REGION: region = 'us-east-2',
	NX_STAGE: stage = 'dev',
	NX_DATABASE_ENABLE_PERFORMANCE_INSIGHTS: enableDbPerformanceInsightsRaw = 'false'
} = process.env;

const enableDbPerformanceInsights = enableDbPerformanceInsightsRaw === 'true';

const applicationName = 'boilerplate';
const stackPrefix = `${applicationName}-${stage}`;

const app = new App();

const env = {
	account: accountId,
	region: region,
};

const { vpc } = new VpcStack(app, `${stackPrefix}-vpc-stack`, { env });

const ecrStack = new EcrRepositoryStack(app, `${stackPrefix}-ecr-stack`, stackPrefix, { env });

const mainStack = new MainStack(app, `${stackPrefix}-stack`, stackPrefix, vpc, enableDbPerformanceInsights, { env });
//
// const ecsStack = new EcsWithLbStack(app, `${stackPrefix}-lb-stack`, {
// 	env,
// });


app.synth();
