import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from 'constructs';
import {
	Vpc,
	IVpc,
} from "aws-cdk-lib/aws-ec2";
import * as docker from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as logs from 'aws-cdk-lib/aws-logs';

interface EcsWithLbStackProps extends StackProps {
	// readonly prefix: string;
	// readonly stage: string;
	readonly deploymentEnvironment?: string;
}

export class EcsWithLbStack extends Stack {
	// public readonly vpc: IVpc;

	constructor(scope: Construct, id: string, props?: EcsWithLbStackProps) {
		super(scope, id, props);
		// const { prefix, stage } = props;


		// const vpc = Vpc.fromLookup(this, 'default-vpc-id', {
		// 	isDefault: true,
		// });

		// this.vpc = vpc;

		const cluster = new ecs.Cluster(this, 'FargateCPCluster', {
		// 	vpc,
		// 	enableFargateCapacityProviders: true,
			clusterName: 'MyCluster',
		});

		// const repository = new ecr.Repository(this, 'MyRepository', {
		// 	repositoryName: 'my_new_repository',
		// });

		// Загрузка Docker-образа в ECR
		// for now let's use full.Dockerfile, didn't try with Dockerfile
		const asset = new docker.DockerImageAsset(this, 'MyDockerImageAsset', {
			directory: path.join(__dirname, '../../../..'),
			file: 'full.Dockerfile',
			buildArgs: {
				arg1: "--require-approval never",
			},
		});

		// Create a Task Definition
		const taskDefinition = new ecs.TaskDefinition(this, 'MyTaskDefinition', {
			compatibility: ecs.Compatibility.FARGATE,
			cpu: '512',
			memoryMiB: '1024',
		});

		// Add container to Task Definition
		const container = taskDefinition.addContainer('MyContainer', {
			image: ecs.ContainerImage.fromDockerImageAsset(asset),
			logging: new ecs.AwsLogDriver({
				streamPrefix: 'MyContainer',
				logRetention: logs.RetentionDays.ONE_DAY,
			}),
		});

		// Add port mappings to container
		container.addPortMappings({
			containerPort: 80,
		});

		const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
			cluster,
			taskDefinition: taskDefinition,
			assignPublicIp: true,
			desiredCount: 1,
		});
	}

		// const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
		// 	// cluster,
		// 	memoryLimitMiB: 512,
		// 	desiredCount: 1,
		// 	cpu: 256,
		// 	taskImageOptions: {
		// 		image: ecs.ContainerImage.fromDockerImageAsset(dockerImage),
		// 	},
		// });
		//
		// const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
		// 	minCapacity: 1,
		// 	maxCapacity: 2,
		// });
		//
		// scalableTarget.scaleOnCpuUtilization('CpuScaling', {
		// 	targetUtilizationPercent: 50,
		// });
		//
		// scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
		// 	targetUtilizationPercent: 50,
		// });
}
