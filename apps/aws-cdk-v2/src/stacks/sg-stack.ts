import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class SgStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// will be better to get from another stack
		const vpc = ec2.Vpc.fromLookup(this, 'default-vpc-id', {
			isDefault: true,
		});

		const sg = new ec2.SecurityGroup(this, 'MySecurityGroup', {
			vpc,
			allowAllOutbound: true,
			description: 'Allow inbound traffic to EC2 instances',
			securityGroupName: 'MySecurityGroup',
		});

		sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');
	}
}
