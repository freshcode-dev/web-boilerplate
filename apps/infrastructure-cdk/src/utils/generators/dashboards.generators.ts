import { Duration, Stack } from 'aws-cdk-lib';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EcsServiceDefinition } from '../../types';
import { AwsMetricsEnum, AwsNamespacesEnum } from '../../constants/aws';

enum Colors {
	red = '#d62728',
	orange = '#ff7f0e',
	blue = '#1f77b4',
	green = '#2ca02c',
}

export type SystemOverviewDashboardParams = {
	dashboardPrefix?: string;
	customMetricsPrefix: string;
	customMetricsNamespace?: string;
	databaseIdentifier: string;
	appDefinition: EcsServiceDefinition;
	loadBalancer: elb.IApplicationLoadBalancer;
	region?: string;
	baseOffsetY?: number;
};

export const createOverviewDashboard = (
	stack: Stack,
	stackPrefix: string,
	params: {
		dashboardPrefix?: string;
	}
) => {
	const dashboardIdentifier = `${[stackPrefix, params.dashboardPrefix].filter(Boolean).join('-')}-overview-dashboard`;
	const dashboard = new cw.Dashboard(stack, dashboardIdentifier, {
		defaultInterval: Duration.days(7),
		periodOverride: cw.PeriodOverride.AUTO,
		dashboardName: dashboardIdentifier.replace(/-/, '_'),
	});

	return dashboard;
};

export const attachWidgetsToOverviewDashboard = (
	dashboard: cw.Dashboard,
	params: SystemOverviewDashboardParams
): {
	offsetY: number;
} => {
	const { customMetricsNamespace = 'CustomMetrics', region = 'us-east-2', customMetricsPrefix } = params;

	const loadBalancerArn = params.loadBalancer.loadBalancerArn.slice(params.loadBalancer.loadBalancerArn.indexOf('/'));
	const targetGroupArn = params.appDefinition.targetGroup!.targetGroupArn;
	const backendTargetGroupArn = `targetgroup/${targetGroupArn.slice(targetGroupArn.indexOf('/'))}`;

	const serviceName = params.appDefinition.service.serviceName;
	const clusterName = params.appDefinition.service.cluster.clusterName;
	const logGroupName = params.appDefinition.logGroup.logGroupName;
	const snsTopicArn = params.appDefinition.snsTopicArn;

	const {
		logsErrorsCount: errorsCountFilter,
		logsWarningsCount: warningsCountFilter,
		apiResponseTime: apiResponseTimeFilter,
		dimensionsMap: customMetricsDimensionsMap,
	} = params.appDefinition.metricFilters!;

	const apiResponseTimeMetricName = apiResponseTimeFilter.metric().metricName;
	const errorsCountMetricName = errorsCountFilter.metric().metricName;
	const warningsCountMetricName = warningsCountFilter.metric().metricName;

	const awsElbDimensionsMap = {
		LoadBalancer: loadBalancerArn,
		TargetGroup: backendTargetGroupArn,
	};

	const awsEcsDimensionsMap = {
		ServiceName: serviceName,
		ClusterName: clusterName,
	};

	const awsRdsDimensionsMap = {
		DBInstanceIdentifier: params.databaseIdentifier,
	};

	const awsContainerInsightsDimensionsMap = awsEcsDimensionsMap;

	const { offsetY: backendMetricsWidgetsOffset } = createBackendMetricsWidget(dashboard, {
		dashboardPrefix: params.dashboardPrefix,
		apiResponseTimeMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsElbDimensionsMap,
		awsEcsDimensionsMap,
		awsContainerInsightsDimensionsMap,
		offsetY: params.baseOffsetY,
	});

	const { offsetY: databaseMetricsWidgetOffset } = createDatabaseMetricsWidget(dashboard, {
		dashboardPrefix: params.dashboardPrefix,
		awsRdsDimensionsMap,
		region,
		offsetY: backendMetricsWidgetsOffset,
	});

	const { offsetY: backendLogsMetricsWidgetsOffset } = createBackendLogsMetricsWidget(dashboard, {
		dashboardPrefix: params.dashboardPrefix,
		backendErrorsMetricName: errorsCountMetricName,
		backendWarningsMetricName: warningsCountMetricName,
		backendLogGroupName: logGroupName,
		backendServiceName: serviceName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		region,
		offsetY: databaseMetricsWidgetOffset,
	});

	const { offsetY: alarmsWidgetsOffset } = createAlarmsWidget(dashboard, {
		dashboardPrefix: params.dashboardPrefix,
		alarmsPrefix: customMetricsPrefix,
		backendErrorsMetricName: errorsCountMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsEcsDimensionsMap,
		awsRdsDimensionsMap,
		snsTopicArn,
		region,
		offsetY: backendLogsMetricsWidgetsOffset,
	});

	return {
		offsetY: alarmsWidgetsOffset,
	};
};

export const defineSystemOverviewDashboard = (
	stack: Stack,
	stackPrefix: string,
	params: SystemOverviewDashboardParams
) => {
	// create dashboard and widgets
	const dashboard = createOverviewDashboard(stack, stackPrefix, {
		dashboardPrefix: params.dashboardPrefix,
	});

	const { offsetY } = attachWidgetsToOverviewDashboard(dashboard, params);

	return { dashboard, offsetY };
};

export const createBackendMetricsWidget = (
	dashboard: cw.Dashboard,
	{
		dashboardPrefix,
		apiResponseTimeMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsElbDimensionsMap,
		awsEcsDimensionsMap,
		awsContainerInsightsDimensionsMap,
		region,
		offsetY = 0,
	}: {
		dashboardPrefix?: string;
		customMetricsNamespace: string;
		apiResponseTimeMetricName: string;
		customMetricsDimensionsMap: { [key: string]: string };
		awsElbDimensionsMap: { [key: string]: string };
		awsEcsDimensionsMap: { [key: string]: string };
		awsContainerInsightsDimensionsMap: { [key: string]: string };
		offsetY?: number;
		region?: string;
	}
): { widgetHeight: number; offsetY: number } => {
	let newOffsetY = offsetY;

	// ROW
	let rowHeight = 1;

	const backendMetricsText = new cw.TextWidget({
		height: rowHeight,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Backend metrics',
	});
	backendMetricsText.position(0, newOffsetY);
	newOffsetY += rowHeight;

	// ROW
	rowHeight = 9;

	const backendOverview = new cw.SingleValueWidget({
		height: rowHeight,
		width: 9,
		sparkline: true,
		title: `Overview${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: AwsNamespacesEnum.ApplicationELB,
				metricName: AwsMetricsEnum.RequestCount,
				label: 'Requests',
				color: Colors.blue,
				region,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: awsElbDimensionsMap,
			}),
			new cw.Metric({
				namespace: customMetricsNamespace,
				metricName: apiResponseTimeMetricName,
				label: 'Response Time',
				color: Colors.blue,
				region,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: customMetricsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ApplicationELB,
				metricName: AwsMetricsEnum.HTTPCode_Target_5XX_Count,
				label: '5XX Responses',
				color: Colors.orange,
				region,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: awsElbDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ApplicationELB,
				metricName: AwsMetricsEnum.UnHealthyHostCount,
				label: 'UnHealthy Hosts',
				color: Colors.red,
				region,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(1),
				dimensionsMap: awsElbDimensionsMap,
			}),
		],
	});
	backendOverview.position(0, newOffsetY);

	const backendCPUUtilization = new cw.SingleValueWidget({
		height: rowHeight,
		width: 5,
		sparkline: true,
		title: `Backend CPU Utilization${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.CPUUtilization,
				label: 'CPUUtilization Average',
				color: Colors.blue,
				region,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.CPUUtilization,
				label: 'CPUUtilization Minimum',
				color: Colors.green,
				region,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.CPUUtilization,
				label: 'CPUUtilization Maximum',
				color: Colors.red,
				region,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
		],
	});
	backendCPUUtilization.position(6, newOffsetY);

	const backendMemoryUtilizationPercent = new cw.SingleValueWidget({
		height: rowHeight,
		width: 5,
		sparkline: true,
		title: `Memory Utilization${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.MemoryUtilization,
				label: 'MemoryUtilization Average',
				color: Colors.blue,
				region,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.MemoryUtilization,
				label: 'MemoryUtilization Minimum',
				color: Colors.green,
				region,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS,
				metricName: AwsMetricsEnum.MemoryUtilization,
				label: 'MemoryUtilization Maximum',
				color: Colors.red,
				region,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsEcsDimensionsMap,
			}),
		],
	});
	backendMemoryUtilizationPercent.position(9, newOffsetY);

	const backendMemoryUtilizationAbsolute = new cw.SingleValueWidget({
		height: rowHeight,
		width: 5,
		sparkline: true,
		title: `Memory Utilized${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS_CONTAINER_INSIGHTS,
				metricName: AwsMetricsEnum.MemoryUtilized,
				label: 'MemoryUtilized Average',
				color: Colors.blue,
				region,
				statistic: cw.Stats.AVERAGE,
				period: Duration.seconds(10),
				dimensionsMap: awsContainerInsightsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS_CONTAINER_INSIGHTS,
				metricName: AwsMetricsEnum.MemoryUtilized,
				label: 'MemoryUtilized Minimum',
				color: Colors.green,
				region,
				statistic: cw.Stats.MINIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsContainerInsightsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.ECS_CONTAINER_INSIGHTS,
				metricName: AwsMetricsEnum.MemoryUtilized,
				label: 'MemoryUtilized Maximum',
				color: Colors.red,
				region,
				statistic: cw.Stats.MAXIMUM,
				period: Duration.seconds(10),
				dimensionsMap: awsContainerInsightsDimensionsMap,
			}),
		],
	});
	backendMemoryUtilizationAbsolute.position(12, newOffsetY);
	newOffsetY += rowHeight;

	dashboard.addWidgets(
		backendMetricsText,
		backendOverview,
		backendCPUUtilization,
		backendMemoryUtilizationPercent,
		backendMemoryUtilizationAbsolute
	);

	return {
		widgetHeight: newOffsetY - offsetY,
		offsetY: newOffsetY,
	};
};

export const createDatabaseMetricsWidget = (
	dashboard: cw.Dashboard,
	{
		dashboardPrefix,
		awsRdsDimensionsMap,
		offsetY = 0,
		region,
	}: {
		dashboardPrefix?: string;
		awsRdsDimensionsMap: { [key: string]: string };
		offsetY?: number;
		region?: string;
	}
): {
	widgetHeight: number;
	offsetY: number;
} => {
	let newOffsetY = offsetY;

	// ROW
	let rowHeight = 1;

	const databaseMetricsText = new cw.TextWidget({
		height: rowHeight,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Database metrics',
	});
	databaseMetricsText.position(0, newOffsetY);
	newOffsetY += rowHeight;

	// ROW
	rowHeight = 5;

	const databaseCPUUtilization = new cw.SingleValueWidget({
		height: rowHeight,
		width: 24,
		sparkline: true,
		title: `CPUUtilization, SwapUsage${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: AwsNamespacesEnum.RDS,
				metricName: AwsMetricsEnum.CPUUtilization,
				region,
				label: 'CPUUtilization',
				color: Colors.blue,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: awsRdsDimensionsMap,
			}),
			new cw.Metric({
				namespace: AwsNamespacesEnum.RDS,
				metricName: AwsMetricsEnum.SwapUsage,
				region,
				label: 'SwapUsage',
				color: Colors.orange,
				statistic: cw.Stats.AVERAGE,
				period: Duration.minutes(1),
				dimensionsMap: awsRdsDimensionsMap,
			}),
		],
	});
	databaseCPUUtilization.position(0, newOffsetY);
	newOffsetY += rowHeight;

	dashboard.addWidgets(databaseMetricsText, databaseCPUUtilization);

	return {
		widgetHeight: newOffsetY - offsetY,
		offsetY: newOffsetY,
	};
};

export const createBackendLogsMetricsWidget = (
	dashboard: cw.Dashboard,
	{
		dashboardPrefix,
		backendErrorsMetricName,
		backendWarningsMetricName,
		backendLogGroupName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		offsetY = 0,
		region,
	}: {
		dashboardPrefix?: string;
		backendErrorsMetricName: string;
		backendWarningsMetricName: string;
		backendLogGroupName: string;
		backendServiceName: string;
		customMetricsNamespace: string;
		customMetricsDimensionsMap: {
			[key: string]: string;
		};
		offsetY?: number;
		region?: string;
	}
): {
	widgetHeight: number;
	offsetY: number;
} => {
	let newOffsetY = offsetY;

	// ROW
	let rowHeight = 1;

	const backendLogsText = new cw.TextWidget({
		height: rowHeight,
		width: 24,
		background: cw.TextWidgetBackground.TRANSPARENT,
		markdown: '# Backend Logs',
	});
	backendLogsText.position(0, newOffsetY);
	newOffsetY += rowHeight;

	// ROW
	rowHeight = 6;

	const backendErrorsAndWarningsCounts = new cw.SingleValueWidget({
		height: rowHeight,
		width: 12,
		sparkline: true,
		title: `Errors and Warnings${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metrics: [
			new cw.Metric({
				namespace: customMetricsNamespace,
				metricName: backendErrorsMetricName,
				region,
				label: 'Errors Count',
				color: Colors.red,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(15),
				dimensionsMap: customMetricsDimensionsMap,
			}),
			new cw.Metric({
				namespace: customMetricsNamespace,
				metricName: backendWarningsMetricName,
				region,
				label: 'Warnings Count',
				color: Colors.orange,
				statistic: cw.Stats.SUM,
				period: Duration.minutes(15),
				dimensionsMap: customMetricsDimensionsMap,
			}),
		],
	});
	backendErrorsAndWarningsCounts.position(10, newOffsetY);

	const backendLatestErrors = new cw.LogQueryWidget({
		height: rowHeight,
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
		title: `Latest errors${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
	});
	backendLatestErrors.position(16, newOffsetY);
	newOffsetY += rowHeight;

	// ROW
	rowHeight = 6;

	const backendUniqueUsersCount = new cw.LogQueryWidget({
		height: rowHeight,
		width: 12,
		region,
		title: `Unique users${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		view: cw.LogQueryVisualizationType.BAR,
		queryLines: [
			'fields @timestamp, @message, @logStream, @log',
			'filter path like "/api/" and path not like "/api/health"',
			'stats count_distinct(currentUserId) as UniqueUsers by bin(1d)',
		],
		logGroupNames: [backendLogGroupName],
	});
	backendLatestErrors.position(0, newOffsetY);

	const backendSlowestEndpoints = new cw.LogQueryWidget({
		height: rowHeight,
		width: 12,
		region,
		title: `Slowest endpoints${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
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
	backendLatestErrors.position(12, newOffsetY);
	newOffsetY += rowHeight;

	dashboard.addWidgets(
		backendLogsText,
		backendLatestErrors,
		backendSlowestEndpoints,
		backendUniqueUsersCount,
		backendErrorsAndWarningsCounts
	);

	return {
		widgetHeight: newOffsetY - offsetY,
		offsetY: newOffsetY,
	};
};

export const createAlarmsWidget = (
	dashboard: cw.Dashboard,
	{
		dashboardPrefix,
		alarmsPrefix,
		backendErrorsMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsEcsDimensionsMap,
		awsRdsDimensionsMap,
		snsTopicArn,
		region,
		offsetY = 0,
	}: {
		dashboardPrefix?: string;
		backendErrorsMetricName: string;
		customMetricsNamespace: string;
		alarmsPrefix: string;
		customMetricsDimensionsMap: { [key: string]: string };
		awsEcsDimensionsMap: { [key: string]: string };
		awsRdsDimensionsMap: { [key: string]: string };
		snsTopicArn?: string;
		region?: string;
		offsetY?: number;
	}
): {
	widgetHeight: number;
	offsetY: number;
} => {
	if (!snsTopicArn) {
		return {
			widgetHeight: 0,
			offsetY,
		};
	}

	const topic = Topic.fromTopicArn(dashboard, 'alarm-topic', snsTopicArn);

	const tooManyErrorsBackend = new cw.Alarm(dashboard, `${alarmsPrefix}-too-many-errors`, {
		alarmName: `Backend Too Many Errors${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metric: new cw.Metric({
			namespace: customMetricsNamespace,
			metricName: backendErrorsMetricName,
			region,
			label: 'Errors Count',
			color: Colors.red,
			statistic: cw.Stats.SUM,
			period: Duration.minutes(15),
			dimensionsMap: customMetricsDimensionsMap,
		}),
		threshold: 10,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
		actionsEnabled: true,
	});
	tooManyErrorsBackend.addAlarmAction(new actions.SnsAction(topic));

	const backendCPUOverload = new cw.Alarm(dashboard, `${alarmsPrefix}-cpu-overload`, {
		alarmName: `Backend CPU Overload${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metric: new cw.Metric({
			namespace: AwsNamespacesEnum.ECS,
			metricName: AwsMetricsEnum.CPUUtilization,
			region,
			label: 'CPUUtilization Average',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: awsEcsDimensionsMap,
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	backendCPUOverload.addAlarmAction(new actions.SnsAction(topic));

	const backendMemoryOverload = new cw.Alarm(dashboard, `${alarmsPrefix}-memory-overload`, {
		alarmName: `Backend Memory Overload${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metric: new cw.Metric({
			namespace: AwsNamespacesEnum.ECS,
			metricName: AwsMetricsEnum.MemoryUtilization,
			region,
			label: 'MemoryUtilization Average',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: awsEcsDimensionsMap,
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	backendMemoryOverload.addAlarmAction(new actions.SnsAction(topic));

	const databaseCPUOverload = new cw.Alarm(dashboard, `${alarmsPrefix}-database-cpu-overload`, {
		alarmName: `Database CPU Overload${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metric: new cw.Metric({
			namespace: AwsNamespacesEnum.RDS,
			metricName: AwsMetricsEnum.CPUUtilization,
			region,
			label: 'CPUUtilization',
			color: Colors.blue,
			statistic: cw.Stats.AVERAGE,
			period: Duration.minutes(15),
			dimensionsMap: awsRdsDimensionsMap,
		}),
		threshold: 70,
		comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
		evaluationPeriods: 1,
	});
	databaseCPUOverload.addAlarmAction(new actions.SnsAction(topic));

	let newOffsetY = offsetY;
	const rowHeight = 9;

	const alarmWidget = new cw.AlarmStatusWidget({
		height: rowHeight,
		width: 5,
		title: `Backend and Database Alarms${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		alarms: [tooManyErrorsBackend, backendCPUOverload, backendMemoryOverload, databaseCPUOverload],
	});
	alarmWidget.position(0, newOffsetY);
	newOffsetY += rowHeight;

	dashboard.addWidgets(alarmWidget);

	return {
		widgetHeight: newOffsetY - offsetY,
		offsetY: newOffsetY,
	};
};
