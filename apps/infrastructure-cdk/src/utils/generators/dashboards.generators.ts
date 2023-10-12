import { Duration, Stack } from 'aws-cdk-lib';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { defineCommonEcsAppMetricFilters } from './cloud-watch.generators';
import { EcsServiceDefinition } from '../../types';

const Colors = {
	red: '#d62728',
	orange: '#ff7f0e',
	blue: '#1f77b4',
	green: '#2ca02c',
};

export type SystemOverviewDashboardParams = {
	region?: string;
	customMetricsNamespace?: string;
	databaseIdentifier: string;
	loadBalancer: elb.IApplicationLoadBalancer;
	appDefinition: EcsServiceDefinition;
};

export const defineSystemOverviewDashboard = (
	stack: Stack,
	stackPrefix: string,
	params: SystemOverviewDashboardParams
) => {
	const { customMetricsNamespace = 'CustomMetrics' } = params;

	const {
		errorsCount: errorsCountFilter,
		warningsCount: warningsCountFilter,
		apiResponseTime: apiResponseTimeFilter,
	} = defineCommonEcsAppMetricFilters(stack, params.appDefinition.logGroup, customMetricsNamespace);

	const dashboardIdentifier = `${stackPrefix}-overview-dashboard`;
	const dashboard = new cw.Dashboard(stack, dashboardIdentifier, {
		defaultInterval: Duration.days(7),
		periodOverride: cw.PeriodOverride.AUTO,
		dashboardName: dashboardIdentifier.replace('-', '_'),
	});

	const loadBalancerArn = params.loadBalancer.loadBalancerArn.slice(params.loadBalancer.loadBalancerArn.indexOf('/'));
	const targetGroupArn = params.appDefinition.targetGroup!.targetGroupArn;
	const backendTargetGroupArn = `targetgroup/${targetGroupArn.slice(targetGroupArn.indexOf('/'))}`;

	createBackendMetrics(
		dashboard,
		loadBalancerArn,
		backendTargetGroupArn,
		apiResponseTimeFilter.metric().namespace,
		apiResponseTimeFilter.metric().metricName,
		params.appDefinition.service.serviceName,
		params.appDefinition.service.cluster.clusterName
	);

	createDatabaseMetrics(dashboard, params.databaseIdentifier, params.region);

	createBackendLogsMetrics(
		dashboard,
		errorsCountFilter.metric().metricName,
		warningsCountFilter.metric().metricName,
		params.appDefinition.logGroup.logGroupName,
		loadBalancerArn,
		backendTargetGroupArn,
		customMetricsNamespace,
		params.region
	);

	createAlarms(
		dashboard,
		params.appDefinition.service.serviceName,
		params.appDefinition.service.cluster.clusterName,
		errorsCountFilter.metric().metricName,
		params.databaseIdentifier,
		customMetricsNamespace,
		loadBalancerArn,
		backendTargetGroupArn,
		params.appDefinition.snsTopicArn,
		params.region
	);

	return dashboard;
};

export const createBackendMetrics = (
	dashboard: cw.Dashboard,
	loadBalancerArn: string,
	backendTargetGroupArn: string,
	apiResponseTimeNamespace: string,
	apResponseTimeMetricName: string,
	backendServiceName: string,
	backendClusterName: string
) => {
	const backendMetricsText = new cw.TextWidget({
		height: 1,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Backend metrics',
	});
	backendMetricsText.position(0, 0);

	const backendOverview = new cw.SingleValueWidget({
		height: 9,
		width: 9,
		sparkline: true,
		title: 'Overview',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'RequestCount',
				label: 'Requests',
				color: Colors.blue,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
			new cw.Metric({
				namespace: apiResponseTimeNamespace,
				metricName: apResponseTimeMetricName,
				label: 'Response Time',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'HTTPCode_Target_5XX_Count',
				label: '5XX Responses',
				color: Colors.orange,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ApplicationELB',
				metricName: 'UnHealthyHostCount',
				label: 'UnHealthy Hosts',
				color: Colors.red,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
		],
	});
	backendOverview.position(0, 1);

	const backendCPUUtilization = new cw.SingleValueWidget({
		height: 9,
		width: 5,
		sparkline: true,
		title: 'Backend CPU Utilization',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Average',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Minimum',
				color: Colors.green,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'CPUUtilization',
				label: 'CPUUtilization Maximum',
				color: Colors.red,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
		],
	});
	backendCPUUtilization.position(6, 1);

	const backendMemoryUtilizationPercent = new cw.SingleValueWidget({
		height: 9,
		width: 5,
		sparkline: true,
		title: 'Memory Utilization',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Average',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Minimum',
				color: Colors.green,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'AWS/ECS',
				metricName: 'MemoryUtilization',
				label: 'Maximum',
				color: Colors.red,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
		],
	});
	backendMemoryUtilizationPercent.position(9, 1);

	const backendMemoryUtilizationAbsolute = new cw.SingleValueWidget({
		height: 9,
		width: 5,
		sparkline: true,
		title: 'Memory Utilized',
		metrics: [
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Average',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Minimum',
				color: Colors.green,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
			new cw.Metric({
				namespace: 'ECS/ContainerInsights',
				metricName: 'MemoryUtilized',
				label: 'Maximum',
				color: Colors.red,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: {
					ServiceName: backendServiceName,
					ClusterName: backendClusterName,
				},
			}),
		],
	});
	backendMemoryUtilizationAbsolute.position(12, 1);

	dashboard.addWidgets(
		backendMetricsText,
		backendOverview,
		backendCPUUtilization,
		backendMemoryUtilizationPercent,
		backendMemoryUtilizationAbsolute
	);
};

export const createDatabaseMetrics = (dashboard: cw.Dashboard, databaseIdentifier: string, region = 'us-east-2') => {
	const databaseMetricsText = new cw.TextWidget({
		height: 1,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Database metrics',
	});
	databaseMetricsText.position(0, 10);

	const databaseCPUUtilization = new cw.SingleValueWidget({
		height: 5,
		width: 24,
		sparkline: true,
		title: 'CPUUtilization, SwapUsage',
		metrics: [
			new cw.Metric({
				namespace: 'AWS/RDS',
				metricName: 'CPUUtilization',
				region,
				label: 'CPUUtilization',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: { DBInstanceIdentifier: databaseIdentifier },
			}),
			new cw.Metric({
				namespace: 'AWS/RDS',
				metricName: 'SwapUsage',
				region,
				label: 'SwapUsage',
				color: Colors.orange,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: { DBInstanceIdentifier: databaseIdentifier },
			}),
		],
	});
	databaseCPUUtilization.position(0, 11);

	dashboard.addWidgets(databaseMetricsText, databaseCPUUtilization);
};

export const createBackendLogsMetrics = (
	dashboard: cw.Dashboard,
	backendErrorsMetricName: string,
	backendWarningsMetricName: string,
	backendLogGroupName: string,
	loadBalancerArn: string,
	backendTargetGroupArn: string,
	customMetricsNamespace: string,
	region = 'us-east-2'
) => {
	const backendLogsText = new cw.TextWidget({
		height: 1,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Backend Logs',
	});
	backendLogsText.position(0, 24);

	const backendErrorsAndWarningsCounts = new cw.SingleValueWidget({
		height: 6,
		width: 12,
		sparkline: true,
		title: 'Errors and Warnings',
		metrics: [
			new cw.Metric({
				namespace: customMetricsNamespace,
				metricName: backendErrorsMetricName,
				region,
				label: 'Errors Count',
				color: Colors.red,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(15),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
			new cw.Metric({
				namespace: customMetricsNamespace,
				metricName: backendWarningsMetricName,
				region,
				label: 'Warnings Count',
				color: Colors.orange,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(15),
				dimensionsMap: {
					LoadBalancer: loadBalancerArn,
					TargetGroup: backendTargetGroupArn,
				},
			}),
		],
	});
	backendErrorsAndWarningsCounts.position(10, 26);

	const backendLatestErrors = new cw.LogQueryWidget({
		height: 7,
		width: 12,
		queryLines: [
			'fields @timestamp, @message, @logStream, @log',
			'filter level = "Error"',
			'sort @timestamp desc',
			'limit 20',
		],
		logGroupNames: [backendLogGroupName],
		region,
		view: cw.LogQueryVisualizationType.TABLE,
		title: 'Latest errors',
	});
	backendLatestErrors.position(16, 4);

	const backendUniqueUsersCount = new cw.LogQueryWidget({
		height: 6,
		width: 12,
		region,
		title: 'Unique users',
		view: cw.LogQueryVisualizationType.BAR,
		queryLines: [
			'fields @timestamp, @message, @logStream, @log',
			'filter path like "/api/" and path not like "/api/health"',
			'stats count_distinct(currentUserId) as UniqueUsers by bin(1d)',
		],
		logGroupNames: [backendLogGroupName],
	});
	backendLatestErrors.position(0, 26);

	const backendSlowestEndpoints = new cw.LogQueryWidget({
		height: 7,
		width: 12,
		region,
		title: 'Slowest endpoints',
		view: cw.LogQueryVisualizationType.TABLE,
		queryLines: [
			'fields @timestamp, @message, @logStream, @log',
			'filter path like "/api/" and path not like "/api/health"',
			'stats avg(responseTime) as AvgResponseTime by path, method',
			'sort AvgResponseTime desc',
			'limit 10',
		],
		logGroupNames: [backendLogGroupName],
	});
	backendLatestErrors.position(10, 19);

	dashboard.addWidgets(
		backendLogsText,
		backendLatestErrors,
		backendSlowestEndpoints,
		backendUniqueUsersCount,
		backendErrorsAndWarningsCounts
	);
};

export const createAlarms = (
	dashboard: cw.Dashboard,
	backendServiceName: string,
	clusterName: string,
	backendErrorsMetricName: string,
	databaseIdentifier: string,
	customMetricsNamespace: string,
	loadBalancerArn: string,
	backendTargetGroupArn: string,
	snsTopicArn?: string,
	region = 'us-east-2'
) => {
	let topic: ITopic | undefined;

	if (snsTopicArn) {
		topic = Topic.fromTopicArn(dashboard, 'alarm-topic', snsTopicArn);
	}

	const tooManyErrorsBackend = new cw.Alarm(dashboard, 'too-many-errors-backend', {
		alarmName: 'Backend Too Many Errors',
		metric: new cw.Metric({
			namespace: customMetricsNamespace,
			metricName: backendErrorsMetricName,
			region,
			label: 'Errors Count',
			color: Colors.red,
			statistic: cw.Stats.SUM,
			period: Duration.minutes(15),
			dimensionsMap: {
				LoadBalancer: loadBalancerArn,
				TargetGroup: backendTargetGroupArn,
			},
		}),
		threshold: 10,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
		actionsEnabled: true,
	});
	topic && tooManyErrorsBackend.addAlarmAction(new actions.SnsAction(topic));

	const backendCPUOverload = new cw.Alarm(dashboard, 'backend-cpu-overload', {
		alarmName: 'Backend CPU Overload',
		metric: new cw.Metric({
			namespace: 'AWS/ECS',
			metricName: 'CPUUtilization',
			region,
			label: 'CPUUtilization Average',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: {
				ServiceName: backendServiceName,
				ClusterName: clusterName,
			},
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	topic && backendCPUOverload.addAlarmAction(new actions.SnsAction(topic));

	const backendMemoryOverload = new cw.Alarm(dashboard, 'backend-memory-overload', {
		alarmName: 'Backend Memory Overload',
		metric: new cw.Metric({
			namespace: 'AWS/ECS',
			metricName: 'MemoryUtilization',
			region,
			label: 'MemoryUtilization Average',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: {
				ServiceName: backendServiceName,
				ClusterName: clusterName,
			},
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	topic && backendMemoryOverload.addAlarmAction(new actions.SnsAction(topic));

	const databaseCPUOverload = new cw.Alarm(dashboard, 'database-cpu-overload', {
		alarmName: 'Database CPU Overload',
		metric: new cw.Metric({
			namespace: 'AWS/RDS',
			metricName: 'CPUUtilization',
			region,
			label: 'CPUUtilization',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: { DBInstanceIdentifier: databaseIdentifier },
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	topic && databaseCPUOverload.addAlarmAction(new actions.SnsAction(topic));

	const alarmWidget = new cw.AlarmStatusWidget({
		height: 9,
		width: 5,
		title: 'Backend and Database Alarms',
		alarms: [tooManyErrorsBackend, backendCPUOverload, backendMemoryOverload, databaseCPUOverload],
	});
	alarmWidget.position(19, 1);

	dashboard.addWidgets(alarmWidget);
};
