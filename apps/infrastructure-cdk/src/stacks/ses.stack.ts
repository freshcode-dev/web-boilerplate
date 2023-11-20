import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

interface SesStackProps extends StackProps {
	emailIdentityDomain: string | undefined;
}

export class SesStack extends Stack {
	public emailIdentity: ses.CfnEmailIdentity;
	constructor(scope: Construct,
							id: string,
							applicationName: string,
							props?: SesStackProps) {
		super(scope, id, props);

		if (!props?.emailIdentityDomain) {
			throw Error(`emailIdentityDomain can't be empty`);
		}

		const identityName = `${applicationName}-identity`;
		this.emailIdentity = new ses.CfnEmailIdentity(this, identityName, {
			emailIdentity: props?.emailIdentityDomain,
		});
		this.emailIdentity.applyRemovalPolicy(RemovalPolicy.RETAIN);

		new CfnOutput(this, 'emailIdentityArn', { value: this.emailIdentity.ref, exportName: 'emailIdentityArn' });
	}
}
