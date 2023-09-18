export const getStacksTags = (applicationName: string, stage: string, deploymentRepositoryUrl: string) => ({
	shared: {
		AppManagerCFNStackKey: `${applicationName}-shared`,
		AppName: applicationName,
		Stage: 'shared',
		DeploymentRepositoryUrl: deploymentRepositoryUrl
	},
	stageBased: {
		AppManagerCFNStackKey: `${applicationName}-${stage}`,
		AppName: applicationName,
		Stage: stage,
		DeploymentRepositoryUrl: deploymentRepositoryUrl
	}
});
