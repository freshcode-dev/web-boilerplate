import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import * as efs from 'aws-cdk-lib/aws-efs';

export interface EcsServiceDefinition {
	task: ecs.FargateTaskDefinition;
	service: ecs.FargateService;
	portMappingName: string;
	port?: number;
	namespaceDnsName?: string;
	passwordSecret?: sm.Secret;

	efsStorage?: efs.CfnFileSystem;
	efsMountTarget?: efs.CfnMountTarget;
}
