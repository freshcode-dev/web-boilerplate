import { RemovalPolicy } from "aws-cdk-lib";
import { CronOptions } from 'aws-cdk-lib/aws-events/lib/schedule';
import { InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';

export interface ICdkEnvironmentSettings {

	/**
	 * If true, creates maintenance lambda to enable and disable the environment based on work hours schedule
	 */
	withMaintenanceSchedule: boolean;
	s3RemovalPolicy: RemovalPolicy;

	// rds
	databaseMode: 'create' | 'reuse';

	rdsReuseParams?: {
		dbSecretArn: string;
		dbSecurityGroupId: string;
	};

	rdsCreationParams?: {
		removalPolicy: RemovalPolicy;
		enablePerformanceInsights: boolean;
		rdsInstanceClass: InstanceClass;
		rdsInstanceSize: InstanceSize;
	};

	/**
	 * If not null, adds CPU-based scaling to the backend service
	 */
	ecsAutoscaling: {
		minCapacity: number;
		maxCapacity: number;
	} | null;
	ecsEnvironmentVariables: Record<string, string>;

	maintenanceSchedule: {
		envStart?: CronOptions;
		envStop?: CronOptions;
	} | null;
	ecsApplicationTaskCpu: number;
	ecsApplicationTaskMemory: number;

	// redis
	ecsRedisTaskCpu: number;
	ecsRedisTaskMemory: number;

	// load-balancing
	// In this project, load balancing is fully handled by a single core load-balancer.
	// Each environment creates it's own stack, which registers itself to the core load balancer to handle requests to some subdomain
	/**
	 * ARN of a listener of the core load balancer
	 */
	loadBalancerListenerArn: string;

	/**
	 * Hostname including subdomain you expect the environment will be accessed by.
	 * Used to make load balancer route the exact part of traffic related to the current environment
	 */
	ecsAppHost: string;
	loadBalancerSecurityGroupId: string;

	// media convert
	mediaConvertRoleRemovalPolicy: RemovalPolicy;
}

export type ApplicationStage = 'cdk-testing';
