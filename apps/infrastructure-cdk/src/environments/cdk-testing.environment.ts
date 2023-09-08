import { ICdkEnvironmentSettings } from './types';
import { RemovalPolicy } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';

export const cdkTestingEnvironmentSettings: ICdkEnvironmentSettings = {
	withMaintenanceSchedule: true,
	databaseMode: 'create',
	rdsCreationParams: {
		removalPolicy: RemovalPolicy.RETAIN,
		enablePerformanceInsights: false,
		rdsInstanceClass: InstanceClass.T3,
		rdsInstanceSize: InstanceSize.MICRO
	},
	s3RemovalPolicy: RemovalPolicy.DESTROY,
	ecsAutoscaling: null,
	ecsEnvironmentVariables: {
		NODE_ENV: 'production',
		NX_SERVE_STATIC: 'true',
		NX_SERVE_STATIC_PATH: 'client',
		NX_ACCESS_TOKEN_SECRET: `barva-dev-access-secret`,
		NX_REFRESH_TOKEN_SECRET: `barva-dev-refresh-secret`,
		NX_ACCESS_TOKEN_EXPIRES_IN: '15min',
		NX_REFRESH_TOKEN_EXPIRES_IN: '7d',
		NX_FRONT_APP_API_URL: '/api',
		NX_FRONT_STAGE_NAME_TO_DISPLAY: 'dev',
		NX_USE_AWS_CREDENTIALS: 'false'
	},
	ecsApplicationTaskCpu: 256,
	ecsApplicationTaskMemory: 512,

	ecsRedisTaskCpu: 256,
	ecsRedisTaskMemory: 512,

	loadBalancerListenerArn: 'arn:aws:elasticloadbalancing:us-east-2:730819153141:listener/app/outsource-shared-lb/df9deec44e861dca/ee3c3c9db74798e3',
	ecsAppHost: 'boilerplate.freshcode.org',
	loadBalancerSecurityGroupId: 'sg-040e5d3c92516f586',

	maintenanceSchedule: {
		envStart: { minute: '0', hour: '6', weekDay: 'MON-FRI', month: '*', year: '*' },
		envStop: { minute: '0', hour: '19', weekDay: 'MON-FRI', month: '*', year: '*' },
	},
	mediaConvertRoleRemovalPolicy: RemovalPolicy.DESTROY
};