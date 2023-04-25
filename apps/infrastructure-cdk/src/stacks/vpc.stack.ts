import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IVpc } from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends Stack {
	public readonly vpc: IVpc;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// will be better to get from another stack
		this.vpc = ec2.Vpc.fromLookup(this, 'default-vpc-id', {
			isDefault: true,
		});
	}
}
