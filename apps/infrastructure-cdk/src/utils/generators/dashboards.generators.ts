import { Duration, Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import { defineCommonEcsAppMetricFilters } from './cloud-watch.generators';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export type SystemOverviewDashboardParams = {
	customMetricsNamespace?: string,
	loadBalancer: elb.IApplicationLoadBalancer;
	backendTargetGroup: elb.IApplicationTargetGroup;
};

export const defineSystemOverviewDashboard = (stack: Stack,
																							resourcesPrefix: string,
																							logGroup: logs.LogGroup,
																							params: SystemOverviewDashboardParams) => {
	const {
		errorsCount: errorsCountFilter,
		warningsCount: warningsCountFilter,
		apiResponseTime: apiResponseTimeFilter
	} = defineCommonEcsAppMetricFilters(stack, resourcesPrefix, logGroup, params.customMetricsNamespace);

	const dashboardIdentifier = `${resourcesPrefix}-overview-dashboard`;
	const dashboard = new cw.Dashboard(stack, dashboardIdentifier, {
		defaultInterval: Duration.days(7),
		periodOverride: cw.PeriodOverride.AUTO,
		dashboardName: dashboardIdentifier.replace('-', '_')
	});



	return dashboard;
}

export const createBackendMetrics = (dashboard: cw.Dashboard,
																		 loadBalancer: elb.IApplicationLoadBalancer,
																		 backendTargetGroup: elb.IApplicationTargetGroup,
																		 apiResponseTimeFilter: logs.MetricFilter,
																		 backendService: ecs.FargateService) => {
	const trimmedLoadBalancerArn = loadBalancer.loadBalancerArn.slice(loadBalancer.loadBalancerArn.indexOf('/'));
	const targetGroupArn = backendTargetGroup.targetGroupArn;
	const trimmedBackendTargetGroupArn = `targetgroup/${targetGroupArn.slice(targetGroupArn.indexOf('/'))}`

	const backendMetricsText = new cw.TextWidget({
		height: 1,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Backend metrics'
	});
	backendMetricsText.position(0, 0);

	const backendOverview = new cw.SingleValueWidget({
		height: 9,
		width: 6,
		sparkline: true,
		title: 'Overview',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'RequestCount',
				label: 'Requests',
				color: '#1f77b4',
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: trimmedLoadBalancerArn,
					TargetGroup: trimmedBackendTargetGroupArn
				}
			}),
			new cw.Metric({
				namespace: apiResponseTimeFilter.metric().namespace,
				metricName: apiResponseTimeFilter.metric().metricName,
				label: 'Requests Count',
				color: '#1f77b4',
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1)
			}),
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'HTTPCode_Target_5XX_Count',
				label: '5XX Responses',
				color: '#ff7f0e',
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: trimmedLoadBalancerArn,
					TargetGroup: trimmedBackendTargetGroupArn
				}
			}),
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'UnHealthyHostCount',
				label: 'UnHealthy Hosts',
				color: '#d62728',
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: trimmedLoadBalancerArn,
					TargetGroup: trimmedBackendTargetGroupArn
				}
			})
		]
	});
	backendOverview.position(0, 1)

	const backendCPUUtilization = new cw.SingleValueWidget({
		height: 9,
		width: 3,
		sparkline: true,
		title: 'Backend CPU Utilization',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Average',
				color: '#1f77b4',
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Minimum',
				color: '#2ca02c',
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Maximum',
				color: '#d62728',
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			})
		]
	});
	backendCPUUtilization.position(6, 1);

	const backendMemoryUtilizationPercent = new cw.SingleValueWidget({
		height: 9,
		width: 3,
		sparkline: true,
		title: 'Memory Utilization',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Average',
				color: '#1f77b4',
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Minimum',
				color: '#2ca02c',
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Maximum',
				color: '#d62728',
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			})
		]
	});
	backendMemoryUtilizationPercent.position(9, 1);

	const backendMemoryUtilizationAbsolute = new cw.SingleValueWidget({
		height: 9,
		width: 3,
		sparkline: true,
		title: 'Memory Utilization',
		metrics: [
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Average',
				color: '#1f77b4',
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Minimum',
				color: '#2ca02c',
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			}),
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Maximum',
				color: '#d62728',
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendService.serviceName,
					ClusterName: backendService.cluster.clusterName
				}
			})
		]
	});
	backendMemoryUtilizationAbsolute.position(12, 1);

	dashboard.addWidgets(
		backendMetricsText,
		backendOverview,
		backendCPUUtilization,
		backendMemoryUtilizationPercent,
		backendMemoryUtilizationAbsolute
	);
}
