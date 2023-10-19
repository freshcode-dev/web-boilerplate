export enum AwsNamespacesEnum {
	ECS = 'AWS/ECS',
	ECS_CONTAINER_INSIGHTS = 'ECS/ContainerInsights',
	RDS = 'AWS/RDS',
	ApplicationELB = 'AWS/ApplicationELB',
}

export enum AwsMetricsEnum {
	// ApplicationELB
	RequestCount = 'RequestCount',
	HTTPCode_Target_5XX_Count = 'HTTPCode_Target_5XX_Count',
	UnHealthyHostCount = 'UnHealthyHostCount',

	// ECS, RDS
	CPUUtilization = 'CPUUtilization',
	MemoryUtilization = 'MemoryUtilization',
	MemoryUtilized = 'MemoryUtilized',
	SwapUsage = 'SwapUsage',
};
