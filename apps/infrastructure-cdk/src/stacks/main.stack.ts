import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
	InstanceClass, InstanceSize, InstanceType, IVpc, Peer, Port, SecurityGroup, SubnetFilter
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import {
	Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, StorageType
} from 'aws-cdk-lib/aws-rds';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Cluster, ContainerImage, Secret as EcsSecret } from 'aws-cdk-lib/aws-ecs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { CronOptions } from 'aws-cdk-lib/aws-events/lib/schedule';
import { getEcrRepositoryName } from '../utils/resource-names.utils';

export interface MainStackProps {
	stackPrefix: string;
	vpc: IVpc;
	enablePerformanceInsights?: boolean;
	maintainersEmails?: string[];
}

export class MainStack extends Stack {
	public rdsDb: DatabaseInstance;
	public dbSecret: Secret;
	public takenPorts: number[] = [];
	public databaseSg: SecurityGroup;
	public commonSg: SecurityGroup;
	public bucket: Bucket;
	public ecsService: ApplicationLoadBalancedFargateService;
	public maintenanceSnsTopic: sns.ITopic;

	public maintenanceSchedule: Record<string, CronOptions> = {
		envStart: { minute: '0', hour: '6', weekDay: 'MON-FRI', month: '*', year: '*' },
		envStop: { minute: '0', hour: '20', weekDay: 'MON-FRI', month: '*', year: '*' },
	};
	constructor(scope: Construct,
							id: string,
							options: MainStackProps,
							props?: StackProps) {
		super(scope, id, props);

		const {
			stackPrefix,
			vpc,
			enablePerformanceInsights,
			maintainersEmails
		} = options;

		this.registerSecurityGroups(stackPrefix, vpc);

		this.registerDatabaseSecret(stackPrefix);

		// this.registerMaintenanceSnsTopic(stackPrefix, maintainersEmails);

		this.registerDatabase(vpc, stackPrefix, enablePerformanceInsights);

		// allow any resource from common security group access any database
		for (const port of this.takenPorts) {
			this.databaseSg.addIngressRule(Peer.securityGroupId(this.commonSg.securityGroupId), Port.tcp(port));
		}

		this.registerS3Bucket(stackPrefix);

		this.registerEcsCluster(vpc, stackPrefix);

		this.registerMaintenanceLambda(stackPrefix);
	}

	private registerSecurityGroups(stackPrefix: string, vpc: IVpc): void {
		const commonSgName = `${stackPrefix}-sg`;
		this.commonSg = new ec2.SecurityGroup(this, commonSgName, {
			vpc,
			allowAllOutbound: true,
			description: 'Restrict allow inbound HTTP traffic to common resources',
			securityGroupName: commonSgName,
		});

		const dbSgName = `${stackPrefix}-db-sg`;
		this.databaseSg = new ec2.SecurityGroup(this, dbSgName, {
			vpc,
			allowAllOutbound: true,
			description: 'Restrict inbound traffic to database resources',
			securityGroupName: dbSgName,
		});
	}

	private registerMaintenanceSnsTopic(stackPrefix: string, maintainersEmails?: string[]): void {
		// ToDo: needs to be finalized and connected to ECS, RDS, and maintenance lambda
		if (!maintainersEmails?.length) {
			return;
		}

		const topicName = `${stackPrefix}-maintenance-topic`;
		this.maintenanceSnsTopic = new sns.Topic(this, topicName, { topicName, displayName: topicName });

		for (const email of maintainersEmails) {
			this.maintenanceSnsTopic.addSubscription(new snsSubscriptions.EmailSubscription(email));
		}
	}

	private registerDatabaseSecret(stackPrefix: string): void {
		const secretName = `${stackPrefix}-db-secret`;
		this.dbSecret = new Secret(this, secretName, {
			secretName,
			description: 'Database secrets storage',
			generateSecretString: {
				secretStringTemplate: JSON.stringify({ username: 'postgres' }),
				generateStringKey: 'password',
				passwordLength: 26,
				excludePunctuation: true,
				excludeLowercase: false,
				excludeNumbers: false,
				includeSpace: false,
				excludeUppercase: false
			}
		});
	}

	private registerDatabase(vpc: IVpc, stackPrefix: string, enablePerformanceInsights?: boolean): void {
		const databaseEngine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_15_2 });
		const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
		const port = 5432;
		// database name can't contain hyphens so they have to be removed
		const dbName = `${stackPrefix}-db`.split('-').join('');

		this.rdsDb = new DatabaseInstance(this, dbName, {
			vpc,
			instanceIdentifier: dbName,
			databaseName: dbName,
			vpcSubnets: { onePerAz: true, subnetFilters: [SubnetFilter.onePerAz()] },
			instanceType,
			engine: databaseEngine,
			port,
			securityGroups: [this.databaseSg],
			credentials: Credentials.fromSecret(this.dbSecret),
			backupRetention: Duration.days(7),
			deleteAutomatedBackups: true,
			removalPolicy: RemovalPolicy.DESTROY, // ToDo: change when deploying the real stack
			maxAllocatedStorage: 100,
			deletionProtection: false,
			autoMinorVersionUpgrade: true,
			publiclyAccessible: true,
			multiAz: false,
			enablePerformanceInsights,
			storageEncrypted: true,
			storageType: StorageType.GP2
		});
		// this.secret.attach(this.rdsDb);

		this.takenPorts.push(port);
	}

	private registerS3Bucket(stackPrefix: string): void {
		const bucketName = `${stackPrefix}-bucket`;
		this.bucket = new s3.Bucket(this, bucketName, {
			bucketName,
			versioned: false, // enable versioning for the bucket
			removalPolicy: cdk.RemovalPolicy.DESTROY, // ToDo: change when deploying the real stack
			encryption: s3.BucketEncryption.S3_MANAGED,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			autoDeleteObjects: true
		});
	}

	private registerMaintenanceLambda(stackPrefix: string): void {
		const functionName = `${stackPrefix}-maintenance-lambda`;

		const appManagerLambda = new lambda.Function(this, functionName, {
			functionName,
			runtime: lambda.Runtime.NODEJS_18_X,
			retryAttempts: 0,
			code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambdas')),
			handler: 'maintenance.handler',
			deadLetterTopic: this.maintenanceSnsTopic ?? undefined,
			environment: {
				ECS_CLUSTER: this.ecsService.cluster.clusterArn,
				ECS_SERVICE: this.ecsService.service.serviceName,
				RDS_INSTANCE_IDENTIFIER: this.rdsDb.instanceIdentifier
			}
		});

		// 👇 create a policy statement
		const allowAll = new iam.PolicyStatement({
			actions: ['*'],
			resources: ['*'],
		});

		// 👇 add the policy to the Function's role
		appManagerLambda.role?.attachInlinePolicy(
			new iam.Policy(this, 'AllowAllPolicy', {
				statements: [allowAll],
			}),
		);

		const startEventRuleName = `${stackPrefix}-start-app-rule`;
		const startEventRule = new events.Rule(this, startEventRuleName, {
			ruleName: startEventRuleName,
			schedule: events.Schedule.cron(this.maintenanceSchedule.envStart),
		});

		const stopEventRuleName = `${stackPrefix}-stop-app-rule`;
		const stopEventRule = new events.Rule(this, stopEventRuleName, {
			ruleName: stopEventRuleName,
			schedule: events.Schedule.cron(this.maintenanceSchedule.envStop),
		});

		// add the Lambda function as a target for the Event Rule
		startEventRule.addTarget(
			new targets.LambdaFunction(appManagerLambda, {
				event: events.RuleTargetInput.fromObject({ newState: 'start' }),
			}),
		);
		stopEventRule.addTarget(
			new targets.LambdaFunction(appManagerLambda, {
				event: events.RuleTargetInput.fromObject({ newState: 'stop' }),
			}),
		);

		// allow the Event Rule to invoke the Lambda function
		targets.addLambdaPermission(startEventRule, appManagerLambda);
		targets.addLambdaPermission(stopEventRule, appManagerLambda);
	}

	private registerEcsCluster(vpc: IVpc, stackPrefix: string): void {
		const clusterName = `${stackPrefix}-cluster`;
		const ecsCluster = new Cluster(this, clusterName, {
			clusterName,
			vpc,
			containerInsights: false
		});

		const repositoryName = getEcrRepositoryName(stackPrefix);
		const repository = Repository.fromRepositoryName(this, repositoryName, repositoryName);

		const serviceName = `${stackPrefix}-ecs-backend`;
		this.ecsService = new ApplicationLoadBalancedFargateService(this, serviceName, {
			serviceName,
			cluster: ecsCluster,
			securityGroups: [this.commonSg],
			cpu: 256,
			memoryLimitMiB: 512,
			desiredCount: 1,
			loadBalancerName: `${stackPrefix}-lb`,
			minHealthyPercent: 50,
			maxHealthyPercent: 200,
			assignPublicIp: true,
			taskImageOptions: {
				image: ContainerImage.fromEcrRepository(repository, 'latest'),
				enableLogging: true,
				containerPort: 3000,
				containerName: 'app',
				family: `${stackPrefix}-task-definition`,
				environment: {
					NX_PORT: '3000',
					NX_DATABASE_ENABLE_LOGGING: 'false',
					NX_DATABASE_ENABLE_MIGRATIONS: 'false',
					NX_ENABLE_VERBOSE_REQUESTS_LOGGING: 'true',
					NX_ENABLE_RESPONSE_BODY_LOGGING: 'false',
					NX_SERVE_STATIC: 'true',
					NX_SERVE_STATIC_PATH: 'client'
				},
				secrets: {
					NX_DATABASE_HOST: EcsSecret.fromSecretsManager(this.dbSecret, 'host'),
					NX_DATABASE_PORT: EcsSecret.fromSecretsManager(this.dbSecret, 'port'),
					NX_DATABASE_USERNAME: EcsSecret.fromSecretsManager(this.dbSecret, 'username'),
					NX_DATABASE_PASSWORD: EcsSecret.fromSecretsManager(this.dbSecret, 'password'),
					NX_DATABASE_NAME: EcsSecret.fromSecretsManager(this.dbSecret, 'dbname')
				}
			},
			circuitBreaker: { rollback: true },
		});

		const scalableTarget = this.ecsService.service.autoScaleTaskCount({
			minCapacity: 1,
			maxCapacity: 3,
		});

		const scalingPolicyName = `${stackPrefix}-cpu-scaling-policy`;
		scalableTarget.scaleOnCpuUtilization(scalingPolicyName, {
			policyName: scalingPolicyName,
			targetUtilizationPercent: 60,
		});

		this.ecsService.targetGroup.configureHealthCheck({
			path: '/api/health',
			interval: Duration.seconds(60),
			port: '3000',
			timeout: Duration.seconds(10)
		});

		this.ecsService.taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			})
		);

		new CfnOutput(this, 'albArn', { value: this.ecsService.service.serviceArn, exportName: 'albArn' });
	}
}
