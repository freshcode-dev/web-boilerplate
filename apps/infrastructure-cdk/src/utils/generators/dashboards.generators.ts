import { Duration, Stack } from 'aws-cdk-lib';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { EcsServiceDefinition } from '../../types';
import { AwsMetricsEnum, AwsNamespacesEnum } from '../../constants/aws';
import { Colors } from '../../constants/colors';

export type SystemOverviewDashboardParams = {
	dashboardPrefix?: string;
	customMetricsNamespace?: string;
	databaseIdentifier: string;
	appDefinition: EcsServiceDefinition;
	loadBalancer: elb.IApplicationLoadBalancer;
	region?: string;
	baseOffsetY?: number;
};

/**
 * Creates a dashboard with widgets for monitoring a backend and db system.
 * Widgets include:
 * - Backend metrics
 * - Database metrics
 * - Backend logs metrics
 * - Alarms widget
 *
 * @param stack - the stack to attach the dashboard to
 * @param stackPrefix - the prefix of the stack
 * @param params - the parameters for the dashboard
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: StackProps) {
 * 	super(scope, id, props);
 *
 * 	// services definition
 *
 * 	defineSystemOverviewDashboard(this, stackPrefix, {
 * 		dashboardPrefix: 'app',
 * 		region: this.region,
 * 		loadBalancer: this.coreLoadBalancer,
 * 		databaseIdentifier: this.rdsDb.instanceIdentifier,
 * 		appDefinition: this.appDefinition,
 * 		baseOffsetY: 0,
 * 		customMetricsNamespace: 'CustomMetrics',
 * 	});
 * }
 * ```
 */
export const defineSystemOverviewDashboard = (
	stack: Stack,
	stackPrefix: string,
	params: SystemOverviewDashboardParams
) => {
	// create dashboard
	const dashboard = createOverviewDashboard(stack, stackPrefix, params);

	// attach widgets to it
	const { offsetY } = attachWidgetsToOverviewDashboard(dashboard, params);

	return { dashboard, offsetY };
};

/**
 * Creates a dashboard with no widgets attached.
 *
 * @param stack
 * @param stackPrefix
 * @param params
 * @returns a CloudWatch dashboard with no widgets
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: StackProps) {
 * 	super(scope, id, props);
 *
 * 	// services definition
 *
 * 	this.dashboard = createOverviewDashboard(this, stackPrefix, {
 * 		dashboardPrefix: 'app',
 * 	});
 * }
 * ```
 */
export const createOverviewDashboard = (
	stack: Stack,
	stackPrefix: string,
	params: {
		dashboardPrefix?: string;
	}
): cw.Dashboard => {
	const { dashboardPrefix } = params;

	const dashboardIdentifier = `${[stackPrefix, dashboardPrefix].filter(Boolean).join('-')}-overview-dashboard`;
	const dashboard = new cw.Dashboard(stack, dashboardIdentifier, {
		defaultInterval: Duration.days(7),
		periodOverride: cw.PeriodOverride.AUTO,
		dashboardName: dashboardIdentifier.replace(/-/, '_'),
	});

	return dashboard;
};

/**
 * Attaches widgets to an existing dashboard.
 * Widgets include:
 * - Backend metrics
 * - Database metrics
 * - Backend logs metrics
 * - Alarms widget
 *
 * @param dashboard - the dashboard to attach widgets to
 * @param params - the parameters for the dashboard
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: StackProps) {
 * 	super(scope, id, props);
 *
 * 	// services definition
 *
 * 	this.dashboard = createOverviewDashboard(this, stackPrefix, {
 * 		dashboardPrefix: 'app',
 * 	});
 *
 * 	attachWidgetsToOverviewDashboard(this.dashboard, {
 * 		dashboardPrefix: 'app',
 * 		region: this.region,
 * 		// ...
 * 	});
 * }
 * ```
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: StackProps) {
 * 	super(scope, id, props);
 *
 * 	// services definition
 *
 * 	this.dashboard = createOverviewDashboard(this, stackPrefix, {
 * 		dashboardPrefix: 'app',
 * 	});
 *
 * 	const { offsetY: app1WidgetsOffset } = attachWidgetsToOverviewDashboard(this.dashboard, {
 * 		dashboardPrefix: 'app1',
 * 		region: this.region,
 * 		// ...
 * 	});
 *
 * 	attachWidgetsToOverviewDashboard(this.dashboard, {
 * 		dashboardPrefix: 'app2',
 * 		region: this.region,
 * 		// ...
 * 		offsetY: app1WidgetsOffset,
 * 	});
 * }
 * ```
 */
export const attachWidgetsToOverviewDashboard = (
	dashboard: cw.Dashboard,
	params: SystemOverviewDashboardParams
): {
	offsetY: number;
} => {
	const {
		baseOffsetY,
		dashboardPrefix,
		customMetricsNamespace = 'CustomMetrics',
		region = 'us-east-2',
		loadBalancer,
		appDefinition,
		databaseIdentifier,
	} = params;

	if (!appDefinition.metricFilters) {
		throw new Error('Dashboard creation requires metric filters');
	}

	if (!appDefinition.targetGroup) {
		throw new Error('Dashboard creation requires appDefinition target group');
	}

	const loadBalancerIndex = loadBalancer.loadBalancerArn.indexOf('/');
	const loadBalancerArn = loadBalancer.loadBalancerArn.slice(loadBalancerIndex === -1 ? 0 : loadBalancerIndex + 1);
	const backendTargetGroup = appDefinition.targetGroup.targetGroupFullName;

	const serviceName = appDefinition.service.serviceName;
	const clusterName = appDefinition.service.cluster.clusterName;
	const logGroupName = appDefinition.logGroup.logGroupName;
	const alarmsArray = Object.values(appDefinition.alarms ?? {});

	const {
		logsErrorsCount: errorsCountFilter,
		logsWarningsCount: warningsCountFilter,
		apiResponseTime: apiResponseTimeFilter,
		dimensionsMap: customMetricsDimensionsMap,
	} = appDefinition.metricFilters;

	const apiResponseTimeMetricName = apiResponseTimeFilter.metric().metricName;
	const errorsCountMetricName = errorsCountFilter.metric().metricName;
	const warningsCountMetricName = warningsCountFilter.metric().metricName;

	const awsElbDimensionsMap = {
		LoadBalancer: loadBalancerArn,
		TargetGroup: backendTargetGroup,
	};

	const awsEcsDimensionsMap = {
		ServiceName: serviceName,
		ClusterName: clusterName,
	};

	const awsRdsDimensionsMap = {
		DBInstanceIdentifier: databaseIdentifier,
	};

	const awsContainerInsightsDimensionsMap = awsEcsDimensionsMap;

	const { offsetY: alarmsWidgetsOffset } = createAlarmsWidget(dashboard, {
		prefix: dashboardPrefix,
		alarmsArray,
		offsetY: baseOffsetY,
	});

	const { offsetY: backendMetricsWidgetsOffset } = createBackendMetricsWidget(dashboard, {
		prefix: dashboardPrefix,
		apiResponseTimeMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsElbDimensionsMap,
		awsEcsDimensionsMap,
		awsContainerInsightsDimensionsMap,
		region,
		offsetY: alarmsWidgetsOffset,
	});

	const { offsetY: databaseMetricsWidgetOffset } = createDatabaseMetricsWidget(dashboard, {
		prefix: dashboardPrefix,
		awsRdsDimensionsMap,
		region,
		offsetY: backendMetricsWidgetsOffset,
	});

	createBackendLogsMetricsWidget(dashboard, {
		prefix: dashboardPrefix,
		backendErrorsMetricName: errorsCountMetricName,
		backendWarningsMetricName: warningsCountMetricName,
		backendLogGroupName: logGroupName,
		backendServiceName: serviceName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		region,
		offsetY: databaseMetricsWidgetOffset,
	});

	return {
		offsetY: alarmsWidgetsOffset,
	};
};

export interface WidgetResultParams {
	widgetHeight: number;
	offsetY: number;
}

export interface BackendMetricsParams {
	prefix?: string;
	customMetricsNamespace: string;
	apiResponseTimeMetricName: string;
	customMetricsDimensionsMap: { [key: string]: string };
	awsElbDimensionsMap: { [key: string]: string };
	awsEcsDimensionsMap: { [key: string]: string };
	awsContainerInsightsDimensionsMap: { [key: string]: string };
	offsetY?: number;
	region?: string;
}

export interface DatabaseMetricsParams {
	prefix?: string;
	awsRdsDimensionsMap: { [key: string]: string };
	offsetY?: number;
	region?: string;
}

export interface BackendLogsMetricsParams {
	prefix?: string;
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

export interface AlarmsParams {
	prefix?: string;
	alarmsArray: cw.Alarm[];
	offsetY?: number;
}

/**
 * Creates a widget with backend metrics.
 * Widgets include:
 * - Overview graph: Requests, Response Time, 5XX Responses, UnHealthy Hosts
 * - CPU Utilization
 * - Memory Utilization
 * - Memory Utilized
 *
 * @example
 * ```typescript
 * constructor(scope: Construct, id: string, props: StackProps) {
 * 	super(scope, id, props);
 *
 * 	// services definition
 *
 * 	this.dashboard = createOverviewDashboard(this, stackPrefix, {
 * 		dashboardPrefix: 'app',
 * 	});
 *
 * 	const { offsetY: appBackendMetricsOffset } = createBackendMetricsWidget(this.dashboard, {
 * 		prefix: 'app',
 * 		region: this.region,
 * 		// ...
 * 	});
 *
 * 	createBackendLogsMetricsWidget(this.dashboard, {
 * 		// ...,
 * 		offsetY: appBackendMetricsOffset,
 * 	});
 * }
 * ```
 */
export const createBackendMetricsWidget = (
	dashboard: cw.Dashboard,
	{
		prefix,
		apiResponseTimeMetricName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		awsElbDimensionsMap,
		awsEcsDimensionsMap,
		awsContainerInsightsDimensionsMap,
		region,
		offsetY = 0,
	}: BackendMetricsParams
): WidgetResultParams => {
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
		title: `Overview${prefix ? ` (${prefix})` : ''}`,
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
		title: `Backend CPU Utilization${prefix ? ` (${prefix})` : ''}`,
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
		title: `Memory Utilization${prefix ? ` (${prefix})` : ''}`,
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
		title: `Memory Utilized${prefix ? ` (${prefix})` : ''}`,
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
	{ prefix: dashboardPrefix, awsRdsDimensionsMap, offsetY = 0, region }: DatabaseMetricsParams
): WidgetResultParams => {
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
		prefix: dashboardPrefix,
		backendErrorsMetricName,
		backendWarningsMetricName,
		backendLogGroupName,
		customMetricsNamespace,
		customMetricsDimensionsMap,
		offsetY = 0,
		region,
	}: BackendLogsMetricsParams
): WidgetResultParams => {
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
			'filter level = "error"',
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
	{ prefix: dashboardPrefix, alarmsArray, offsetY = 0 }: AlarmsParams
): WidgetResultParams => {
	if (!alarmsArray.length) {
		return {
			widgetHeight: 0,
			offsetY,
		};
	}

	let newOffsetY = offsetY;
	const rowHeight = 3;

	const alarmWidget = new cw.AlarmStatusWidget({
		height: rowHeight,
		width: 24,
		title: `Backend and Database Alarms${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		alarms: alarmsArray,
	});
	alarmWidget.position(0, newOffsetY);
	newOffsetY += rowHeight;

	dashboard.addWidgets(alarmWidget);

	return {
		widgetHeight: newOffsetY - offsetY,
		offsetY: newOffsetY,
	};
};
