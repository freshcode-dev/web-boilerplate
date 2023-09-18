import { Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export const lookupDefaultVpc = (stack: Stack, id: string) => (
	ec2.Vpc.fromLookup(stack, id, {
		isDefault: true,
	})
);
