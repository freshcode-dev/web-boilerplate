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
			lifecycleRules: [{ maxImageCount: 2 }],
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteImages: true
		});

		new CfnOutput(this, `${stackPrefix}-ecrRepoName`, { value: this.repository.repositoryName, exportName: `${stackPrefix}-ecrRepoName` });
		new CfnOutput(this, `${stackPrefix}-ecrRepoArn`, { value: this.repository.repositoryArn, exportName: `${stackPrefix}-ecrRepoArn` });
		new CfnOutput(this, `${stackPrefix}-ecrRepoUrl`, { value: this.repository.repositoryUri, exportName: `${stackPrefix}-ecrRepoUrl` });
	}
}
