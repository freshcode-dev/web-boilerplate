import { Duration, RemovalPolicy, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
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
import * as iam from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class MainStack extends Stack {
	public rdsDb: DatabaseInstance;
	public secret: Secret;
	public takenPorts: number[] = [];
	public databaseSg: SecurityGroup;
	public commonSg: SecurityGroup;
	public bucket: Bucket;

	constructor(scope: Construct,
							id: string,
							stackPrefix: string,
							vpc: IVpc,
							enablePerformanceInsights?: boolean,
							props?: StackProps) {
		super(scope, id, props);

		this.registerSecurityGroups(scope, id, stackPrefix, vpc);

		this.registerDatabaseSecret(stackPrefix);

		this.registerDatabase(vpc, stackPrefix, enablePerformanceInsights);

		// allow any resource from common security group access any database
		for (const port of this.takenPorts) {
			this.databaseSg.addIngressRule(Peer.securityGroupId(this.commonSg.securityGroupId), Port.tcp(port));
		}

		this.registerS3Bucket(stackPrefix);
	}

	private registerSecurityGroups(scope: Construct, id: string, stackPrefix: string, vpc: IVpc): void {
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

	private registerDatabaseSecret(stackPrefix: string): void {
		const secretName = `${stackPrefix}-db-secret`;
		this.secret = new Secret(this, secretName, {
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
			vpcSubnets: { onePerAz: true, subnetFilters: [SubnetFilter.onePerAz()] },
			instanceType,
			engine: databaseEngine,
			port,
			securityGroups: [this.databaseSg],
			databaseName: dbName,
			credentials: Credentials.fromSecret(this.secret),
			backupRetention: Duration.days(7),
			deleteAutomatedBackups: true,
			removalPolicy: RemovalPolicy.DESTROY, // ToDo: change when deploying the real stack
			maxAllocatedStorage: 100,
			deletionProtection: false,
			autoMinorVersionUpgrade: true,
			enablePerformanceInsights,
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

		// Create an IAM policy to allow access to the S3 bucket
		const policy = new iam.PolicyStatement({
			actions: ['s3:*'],
			resources: [this.bucket.bucketArn, `${this.bucket.bucketArn}/*`],
			principals: [new iam.AnyPrincipal()]
		});

		// Add the policy to the bucket
		// this.bucket.addToResourcePolicy(policy);
	}
}
