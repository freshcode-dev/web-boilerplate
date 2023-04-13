import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class S3Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// Create an S3 bucket
		const bucket = new s3.Bucket(this, 'MyBucket', {
			versioned: true, // enable versioning for the bucket
			removalPolicy: cdk.RemovalPolicy.DESTROY, // remove the bucket if the stack is destroyed
			encryption: s3.BucketEncryption.S3_MANAGED, // use S3-managed encryption for the bucket
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // block all public access to the bucket
			autoDeleteObjects: true // automatically delete objects when the bucket is deleted
		});

		// Create an IAM policy to allow access to the S3 bucket
		const policy = new iam.PolicyStatement({
			actions: ['s3:*'],
			resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
			principals: [new iam.AnyPrincipal()]
		});

		// Add the policy to the bucket
		bucket.addToResourcePolicy(policy);

		// Upload a file to the S3 bucket
		// new s3deploy.BucketDeployment(this, 'MyBucketDeployment', {
		// 	sources: [s3deploy.Source.asset('./path/to/local/folder')],
		// 	destinationBucket: bucket
		// });
	}
}
