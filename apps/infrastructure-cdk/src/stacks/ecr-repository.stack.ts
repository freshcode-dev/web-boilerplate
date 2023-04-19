import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { getEcrRepositoryName } from '../utils/resource-names.utils';

export class EcrRepositoryStack extends Stack {
	public readonly repository: Repository;
	constructor(scope: Construct, id: string, stackPrefix: string, props?: StackProps) {
		super(scope, id, props);

		const applicationRepoName = getEcrRepositoryName(stackPrefix);

		this.repository = new Repository(this, applicationRepoName, {
			repositoryName: applicationRepoName,
			lifecycleRules: [{ maxImageCount: 5 }],
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteImages: true
		});

		new CfnOutput(this, 'ecrRepoName', { value: this.repository.repositoryName, exportName: 'ecrRepoName' });
		new CfnOutput(this, 'ecrRepoArn', { value: this.repository.repositoryArn, exportName: 'ecrRepoArn' });
		new CfnOutput(this, 'ecrRepoUrl', { value: this.repository.repositoryUri, exportName: 'ecrRepoUrl' });
	}
}
