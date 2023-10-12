import { RemovalPolicy } from "aws-cdk-lib";
import { CronOptions } from 'aws-cdk-lib/aws-events/lib/schedule';
import { InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';

export type ICdkEnvironmentSettings = {
	s3RemovalPolicy: RemovalPolicy;

	/**
	 * Defines, if infrastructure should reuse some existing RDS database, or create a new one
	 */
	databaseMode: 'create' | 'reuse';

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
	 * ARN of a load balancer
	 */
	loadBalancerArn: string;
	/**
	 * Load balancer priority for a rule routing traffic to this environment
	 * @example usually from 1 to 1000
	 */
	loadBalancerRulePriority: number;

	/**
	 * Hostname including subdomain you expect the environment will be accessed by.
	 * Used to make load balancer route the exact part of traffic related to the current environment
	 */
	ecsAppHost: string;
	loadBalancerSecurityGroupId: string;

	// media convert
	mediaConvertRoleRemovalPolicy: RemovalPolicy;

	// sns
	snsTopicArn?: string;
}
& (WithAutoScalingEnvironmentSettings | WithoutAutoScalingEnvironmentSettings)
& (WithDatabaseCreationEnvironmentSettings | WithDatabaseReusingEnvironmentSettings);

type WithAutoScalingEnvironmentSettings = {
	/**
	 * If true, creates maintenance lambda to enable and disable the environment based on work hours schedule
	 */
	withMaintenanceSchedule: true;

	maintenanceSchedule: {
		envStart: CronOptions;
		envStop: CronOptions;
	};
};

type WithoutAutoScalingEnvironmentSettings = {
	/**
	 * If no, makes the environment available all the time
	 */
	withMaintenanceSchedule: false;
};

type WithDatabaseCreationEnvironmentSettings = {
	databaseMode: 'reuse';

	rdsReuseParams: {
		dbSecretArn: string;
		dbSecurityGroupId: string;
	};
};

type WithDatabaseReusingEnvironmentSettings = {
	databaseMode: 'create';

	rdsCreationParams: {
		removalPolicy: RemovalPolicy;
		enablePerformanceInsights: boolean;
		rdsInstanceClass: InstanceClass;
		rdsInstanceSize: InstanceSize;
	};
};

export type ApplicationStage = 'cdk-testing';
