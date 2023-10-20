import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as awsLogs from 'aws-cdk-lib/aws-logs';

export interface EcsServiceDefinition {
	task: ecs.FargateTaskDefinition;
	service: ecs.FargateService;
	targetGroup?: elb.ApplicationTargetGroup;
	logGroup: awsLogs.LogGroup;
	portMappingName: string;
	snsTopicArn?: string;
	port?: number;
	namespaceDnsName?: string;
	passwordSecret?: sm.Secret;

	efsStorage?: efs.CfnFileSystem;
	efsMountTarget?: efs.CfnMountTarget;

	metricFilters?: {
		dimensionsMap: Record<string, string>;
		logsErrorsCount: awsLogs.MetricFilter;
		logsWarningsCount: awsLogs.MetricFilter;
		apiResponseTime: awsLogs.MetricFilter;
	};
}
