import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import {
	Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, StorageType
} from 'aws-cdk-lib/aws-rds';
import { ISecret, Secret } from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as cloudMap from 'aws-cdk-lib/aws-servicediscovery';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ICdkEnvironmentSettings } from '../environments';
import {
	ApplicationListener,
	ApplicationProtocol,
	ApplicationTargetGroup,
	ListenerAction,
	ListenerCondition,
	TargetType
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ICluster } from 'aws-cdk-lib/aws-ecs/lib/cluster';
import { getEcrRepositoryName } from '../utils/resource-names.utils';
import { EcsServiceDefinition } from '../types';

export interface MainStackProps {
	stackPrefix: string;
	vpc: ec2.IVpc;
	stageSettings: ICdkEnvironmentSettings;
}

export class MainStack extends Stack {
	public rdsDb: DatabaseInstance;
	public dbSecret: ISecret;
	public databaseSg: ec2.ISecurityGroup;
	public commonSg: ec2.ISecurityGroup;
	public redisSg: ec2.SecurityGroup;
	public bucket: Bucket;
	public ecsCluster: ICluster;
	public mediaConvertDefaultRole: iam.Role;
	public namespace: cloudMap.HttpNamespace;
	private readonly redisDefinition: EcsServiceDefinition;
	private readonly appDefinition: EcsServiceDefinition;
	private readonly stageSettings: ICdkEnvironmentSettings;

	constructor(scope: Construct,
							id: string,
							options: MainStackProps,
							props?: StackProps) {
		super(scope, id, props);

		const {
			stackPrefix,
			vpc
		} = options;

		this.stageSettings = options.stageSettings;

		this.registerSecurityGroups(stackPrefix, vpc);

		if (this.stageSettings.databaseMode === 'create') {
			this.createDatabaseSecret(stackPrefix);

			this.createDatabase(vpc, stackPrefix);
		} else {
			this.importDatabaseSecret(stackPrefix);
		}

		this.registerS3Bucket(stackPrefix);

		this.registerMediaConvertData(stackPrefix);

		this.registerNamespace(stackPrefix);
		this.registerEcsCluster(vpc, stackPrefix);
		this.redisDefinition = this.registerRedisService(stackPrefix);
		this.appDefinition = this.registerEcsAppService(vpc, stackPrefix);

		if (this.stageSettings.withMaintenanceSchedule) {
			this.registerMaintenanceLambda(stackPrefix);
		}
	}

	private registerNamespace(stackPrefix: string) {
		const namespaceName = `${stackPrefix}-namespace`;
		this.namespace = new cloudMap.HttpNamespace(this, namespaceName, {
			name: namespaceName
		});
	}

	private registerSecurityGroups(stackPrefix: string, vpc: ec2.IVpc): void {
		const commonSgName = `${stackPrefix}-sg`;
		this.commonSg = new ec2.SecurityGroup(this, commonSgName, {
			vpc,
			allowAllOutbound: true,
			description: 'Restrict allow inbound HTTP traffic to common resources',
			securityGroupName: commonSgName,
		});

		const dbSgName = `${stackPrefix}-db-sg`;

		if (this.stageSettings.databaseMode === 'create') {
			this.databaseSg = new ec2.SecurityGroup(this, dbSgName, {
				vpc,
				allowAllOutbound: true,
				description: 'Restrict inbound traffic to database resources',
				securityGroupName: dbSgName,
			});
		} else {
			if (!this.stageSettings.rdsReuseParams) {
				throw new Error('rdsReuseParams cannot be null');
			}

			this.databaseSg = ec2.SecurityGroup.fromSecurityGroupId(this, dbSgName, this.stageSettings.rdsReuseParams?.dbSecurityGroupId);
		}

		const redisSgName = `${stackPrefix}-redis-sg`;
		this.redisSg = new ec2.SecurityGroup(this, redisSgName, {
			vpc,
			allowAllOutbound: true,
			description: 'Restrict access to redis',
			securityGroupName: redisSgName,
		});
	}

	private importDatabaseSecret(stackPrefix: string): void {
		if (!this.stageSettings.rdsReuseParams) {
			throw new Error('rdsReuseParams cannot be null');
		}

		const secretName = `${stackPrefix}-db-secret`;
		this.dbSecret = Secret.fromSecretCompleteArn(this, secretName, this.stageSettings.rdsReuseParams?.dbSecretArn);
	}

	private createDatabaseSecret(stackPrefix: string): void {
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

	private createDatabase(vpc: ec2.IVpc, stackPrefix: string): void {
		if (!this.stageSettings.rdsCreationParams) {
			throw Error(`rdsCreationParams can't be empty`);
		}

		const databaseEngine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_15_2 });
		const instanceType = ec2.InstanceType.of(
			this.stageSettings.rdsCreationParams?.rdsInstanceClass,
			this.stageSettings.rdsCreationParams?.rdsInstanceSize
		);
		const port = 5432;
		// database name can't contain hyphens, so they have to be removed
		const dbName = `${stackPrefix}-db`.split('-').join('');

		this.rdsDb = new DatabaseInstance(this, dbName, {
			vpc,
			instanceIdentifier: dbName,
			databaseName: dbName,
			vpcSubnets: { onePerAz: true, subnetFilters: [ec2.SubnetFilter.onePerAz()] },
			instanceType,
			engine: databaseEngine,
			port,
			securityGroups: [this.databaseSg],
			credentials: Credentials.fromSecret(this.dbSecret),
			backupRetention: Duration.days(7),
			deleteAutomatedBackups: true,
			removalPolicy: this.stageSettings.rdsCreationParams?.removalPolicy,
			allocatedStorage: 20,
			maxAllocatedStorage: 200,
			deletionProtection: false,
			autoMinorVersionUpgrade: true,
			publiclyAccessible: true,
			multiAz: false,
			enablePerformanceInsights: this.stageSettings.rdsCreationParams?.enablePerformanceInsights,
			storageEncrypted: true,
			storageType: StorageType.GP2
		});
		// this.secret.attach(this.rdsDb);

		this.databaseSg.addIngressRule(ec2.Peer.securityGroupId(this.commonSg.securityGroupId), ec2.Port.tcp(port));
	}

	private registerRedisService(stackPrefix: string): EcsServiceDefinition {
		const serviceAlias = 'redis';
		const port = 6379;

		const secretName = `${stackPrefix}-${serviceAlias}-secret`;
		const passwordSecret = new Secret(this, secretName, {
			secretName,
			description: 'Redis secrets storage',
			generateSecretString: {
				secretStringTemplate: JSON.stringify({ username: 'redis' }),
				generateStringKey: 'password',
				passwordLength: 26,
				excludePunctuation: true,
				excludeLowercase: false,
				excludeNumbers: false,
				includeSpace: false,
				excludeUppercase: false
			}
		});

		// Logs Storage
		const logGroupName = `${stackPrefix}-${serviceAlias}-logs`;
		const logGroup = new LogGroup(this, logGroupName, {
			logGroupName,
			removalPolicy: RemovalPolicy.DESTROY,
			retention: RetentionDays.TWO_WEEKS
		});

		const taskDefinitionFamily = `${stackPrefix}-${serviceAlias}-task`;
		const taskDefinition = new ecs.FargateTaskDefinition(this, taskDefinitionFamily, {
			cpu: this.stageSettings.ecsRedisTaskCpu,
			memoryLimitMiB: this.stageSettings.ecsRedisTaskMemory,
			family: taskDefinitionFamily
		});

		const containerName = serviceAlias;
		const portMappingName = 'mapping';

		const serviceName = `${stackPrefix}-${serviceAlias}-service`;

		taskDefinition.addContainer(containerName, {
			containerName,
			image: ecs.ContainerImage.fromRegistry('bitnami/redis:latest'),
			logging: ecs.LogDriver.awsLogs({ logGroup, streamPrefix: serviceName }),
			portMappings: [{ containerPort: port, hostPort: port, protocol: ecs.Protocol.TCP, name: portMappingName }],
			environment: {
				LOG_LEVEL: 'debug'
			},
			secrets: {
				REDIS_PASSWORD: ecs.Secret.fromSecretsManager(passwordSecret, 'password')
			}
		});

		taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			})
		);

		const namespaceDnsName = `${serviceAlias}.${this.namespace.namespaceName}`;

		this.redisSg.addIngressRule(ec2.Peer.securityGroupId(this.commonSg.securityGroupId), ec2.Port.tcp(port));

		const service = new ecs.FargateService(this, serviceName, {
			serviceName,
			cluster: this.ecsCluster,
			securityGroups: [this.redisSg],
			assignPublicIp: true,
			circuitBreaker: { rollback: true },
			desiredCount: 1,
			minHealthyPercent: 50,
			maxHealthyPercent: 200,
			taskDefinition,
			serviceConnectConfiguration: {
				namespace: this.namespace.namespaceArn,
				services: [
					{
						port,
						dnsName: namespaceDnsName,
						discoveryName: serviceName,
						portMappingName,
					}
				]
			}
		});

		return {
			service,
			task: taskDefinition,
			passwordSecret,
			portMappingName,
			namespaceDnsName,
			port
		};
	}

	private registerS3Bucket(stackPrefix: string): void {
		const bucketName = `${stackPrefix}-bucket`;
		this.bucket = new s3.Bucket(this, bucketName, {
			bucketName,
			versioned: false, // enable versioning for the bucket
			removalPolicy: this.stageSettings.s3RemovalPolicy, // ToDo: change when deploying the real stack
			encryption: s3.BucketEncryption.S3_MANAGED,
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			autoDeleteObjects: true,
			cors: [
				{
					allowedMethods: [
						s3.HttpMethods.GET,
						s3.HttpMethods.POST,
						s3.HttpMethods.PUT,
					],
					allowedOrigins: ['*'],
					allowedHeaders: ['*'],
				}
			]
		});
	}

	private registerMediaConvertData(stackPrefix: string): void {
		const roleName = `${stackPrefix}-media-convert-default-role`;
		this.mediaConvertDefaultRole = new iam.Role(this, roleName, {
			roleName,
			assumedBy: new iam.ServicePrincipal('mediaconvert.amazonaws.com'),
			managedPolicies: [
				iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
				iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'),
			],
		});
		this.mediaConvertDefaultRole.applyRemovalPolicy(this.stageSettings.mediaConvertRoleRemovalPolicy);
	}

	private registerMaintenanceLambda(stackPrefix: string): void {
		if (!this.stageSettings.maintenanceSchedule) {
			return;
		}

		const functionName = `${stackPrefix}-maintenance-lambda`;

		const environment: Record<string, string> = {
			ECS_CLUSTER: this.ecsCluster.clusterArn,
			ECS_SERVICES: JSON.stringify([this.appDefinition.service.serviceName, this.redisDefinition.service.serviceName]),
		};

		if (this.stageSettings.databaseMode === 'create') {
			environment.RDS_INSTANCE_IDENTIFIER = this.rdsDb.instanceIdentifier;
		}

		const appManagerLambda = new lambda.Function(this, functionName, {
			functionName,
			runtime: lambda.Runtime.NODEJS_18_X,
			retryAttempts: 0,
			code: lambda.Code.fromAsset(path.join(__dirname, '..', 'lambdas')),
			handler: 'maintenance.handler',
			environment
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

		if (this.stageSettings.maintenanceSchedule.envStart) {
			const startEventRuleName = `${stackPrefix}-start-app-rule`;
			const startEventRule = new events.Rule(this, startEventRuleName, {
				ruleName: startEventRuleName,
				schedule: events.Schedule.cron(this.stageSettings.maintenanceSchedule.envStart),
			});

			// add the Lambda function as a target for the Event Rule
			startEventRule.addTarget(
				new targets.LambdaFunction(appManagerLambda, {
					event: events.RuleTargetInput.fromObject({ newState: 'start' }),
				}),
			);

			// allow the Event Rule to invoke the Lambda function
			targets.addLambdaPermission(startEventRule, appManagerLambda);
		}

		if (this.stageSettings.maintenanceSchedule.envStop) {
			const stopEventRuleName = `${stackPrefix}-stop-app-rule`;
			const stopEventRule = new events.Rule(this, stopEventRuleName, {
				ruleName: stopEventRuleName,
				schedule: events.Schedule.cron(this.stageSettings.maintenanceSchedule.envStop),
			});

			// add the Lambda function as a target for the Event Rule
			stopEventRule.addTarget(
				new targets.LambdaFunction(appManagerLambda, {
					event: events.RuleTargetInput.fromObject({ newState: 'stop' }),
				}),
			);

			// allow the Event Rule to invoke the Lambda function
			targets.addLambdaPermission(stopEventRule, appManagerLambda);
		}
	}

	private registerEcsCluster(vpc: ec2.IVpc, stackPrefix: string): void {
		const clusterName = `${stackPrefix}-cluster`;
		this.ecsCluster = new ecs.Cluster(this, clusterName, {
			clusterName,
			vpc,
			containerInsights: false
		});
	}

	private registerEcsAppService(vpc: ec2.IVpc, stackPrefix: string): EcsServiceDefinition {
		const repositoryName = getEcrRepositoryName(stackPrefix);
		const repository = Repository.fromRepositoryName(this, repositoryName, repositoryName);

		const serviceName = `${stackPrefix}-ecs-backend`;

		// Logs Storage
		const logGroupName = `${stackPrefix}-app-logs`;
		const logGroup = new LogGroup(this, logGroupName, {
			logGroupName,
			removalPolicy: RemovalPolicy.DESTROY,
			retention: RetentionDays.TWO_WEEKS
		});

		// Task definition
		const taskDefinitionFamily = `${stackPrefix}-task-definition`;
		const taskDefinition = new ecs.FargateTaskDefinition(this, taskDefinitionFamily, {
			cpu: this.stageSettings.ecsApplicationTaskCpu,
			memoryLimitMiB: this.stageSettings.ecsApplicationTaskMemory,
			family: taskDefinitionFamily
		});

		const containerName = 'app';
		const portMappingName = 'mapping';

		taskDefinition.addContainer(containerName, {
			containerName,
			image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
			logging: ecs.LogDriver.awsLogs({ logGroup, streamPrefix: serviceName }),
			portMappings: [{ containerPort: 3000, hostPort: 3000, protocol: ecs.Protocol.TCP, name: portMappingName }],
			environment: {
				...this.stageSettings.ecsEnvironmentVariables,
				NX_AWS_S3_BUCKET_NAME: this.bucket.bucketName,
				AWS_MEDIA_CONVERT_ROLE: this.mediaConvertDefaultRole.roleArn,
				NX_FRONTEND_URL: `https://${this.stageSettings.ecsAppHost}`,
				NX_REDIS_HOST: this.redisDefinition.namespaceDnsName!,
				NX_REDIS_PORT: String(this.redisDefinition.port!),
			},
			secrets: {
				NX_REDIS_PASSWORD: ecs.Secret.fromSecretsManager(this.redisDefinition.passwordSecret!, 'password'),
				NX_DATABASE_HOST: ecs.Secret.fromSecretsManager(this.dbSecret, 'host'),
				NX_DATABASE_PORT: ecs.Secret.fromSecretsManager(this.dbSecret, 'port'),
				NX_DATABASE_USERNAME: ecs.Secret.fromSecretsManager(this.dbSecret, 'username'),
				NX_DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(this.dbSecret, 'password'),
				NX_DATABASE_NAME: ecs.Secret.fromSecretsManager(this.dbSecret, 'dbname')
			}
		});

		taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			})
		);

		// ECS Service
		const ecsService = new ecs.FargateService(this, serviceName, {
			serviceName,
			cluster: this.ecsCluster,
			securityGroups: [this.commonSg],
			assignPublicIp: true,
			circuitBreaker: { rollback: true },
			desiredCount: 1,
			minHealthyPercent: 50,
			maxHealthyPercent: 200,
			taskDefinition,
			serviceConnectConfiguration: {
				namespace: this.namespace.namespaceArn
			}
		});

		const targetGroupName = `${stackPrefix}-app-target-group`;
		const targetGroup = new ApplicationTargetGroup(this, targetGroupName, {
			vpc,
			targetGroupName,
			port: 80,
			protocol: ApplicationProtocol.HTTP,
			targetType: TargetType.IP
		});

		ecsService.attachToApplicationTargetGroup(targetGroup);

		targetGroup.configureHealthCheck({
			path: '/api/health',
			healthyThresholdCount: 2,
			unhealthyThresholdCount: 5,
			interval: Duration.seconds(30),
			port: '3000',
			timeout: Duration.seconds(10)
		});

		const albSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, `${stackPrefix}-alb-securityGroup`, this.stageSettings.loadBalancerSecurityGroupId);

		const listener = ApplicationListener.fromApplicationListenerAttributes(this,
			`${stackPrefix}-alb-listener`,
			{
				listenerArn: this.stageSettings.loadBalancerListenerArn,
				securityGroup: albSecurityGroup
			});

		listener.addAction(`${stackPrefix}-ecs-forward`, {
			action: ListenerAction.forward([targetGroup]),
			conditions: [
				ListenerCondition.hostHeaders([this.stageSettings.ecsAppHost])
			],
			priority: 1
		});

		const autoscalingSettings = this.stageSettings.ecsAutoscaling;

		if (autoscalingSettings) {
			const scalableTarget = ecsService.autoScaleTaskCount({
				minCapacity: autoscalingSettings.minCapacity,
				maxCapacity: autoscalingSettings.maxCapacity,
			});

			const scalingPolicyName = `${stackPrefix}-cpu-scaling-policy`;
			scalableTarget.scaleOnCpuUtilization(scalingPolicyName, {
				policyName: scalingPolicyName,
				targetUtilizationPercent: 60,
			});
		}

		ecsService.taskDefinition.taskRole.addToPrincipalPolicy(
			new iam.PolicyStatement({
				resources: ['*'],
				actions: ['*'],
				effect: iam.Effect.ALLOW,
			})
		);

		new CfnOutput(this, `${stackPrefix}-albArn`, { value: ecsService.serviceArn, exportName: `${stackPrefix}-albArn` });
		new CfnOutput(this, `${stackPrefix}-ecsClusterName`, { value: ecsService.cluster.clusterName, exportName: `${stackPrefix}-ecsClusterName` });
		new CfnOutput(this, `${stackPrefix}-ecsServiceName`, { value: ecsService.serviceName, exportName: `${stackPrefix}-ecsServiceName` });

		return {
			service: ecsService,
			task: taskDefinition,
			portMappingName
		};
	}
}
