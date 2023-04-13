import { App } from 'aws-cdk-lib';
import { EcsLbStack, SgStack, S3Stack } from './stacks';
import * as process from 'process';

const app = new App();
const {
	CDK_DEFAULT_ACCOUNT: accountId = "[AWS ACCOUNT ID]",
	CDK_DEFAULT_REGION: region = "eu-central-1",
} = process.env;

const env = {
	account: accountId,
	region: region,
};

const ecsStack = new EcsLbStack(app, 'infra-stack', {
	env,
});

const sgStack = new SgStack(app, 'sg-stack', {
	env,
});

const s3Stack = new S3Stack(app, 's3-stack', {
	env,
});


app.synth();
