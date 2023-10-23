import { Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export interface DefineCommonEcsAppMetricFiltersProps {
	applicationArn: string;
	applicationName: string;
	logGroup: logs.LogGroup;
	customMetricsNamespace?: string;
	customMetricsPrefix?: string;
	stackPrefix: string;
}

export interface DefineCommonEcsAppMetricFiltersResult {
	errorsCount: logs.MetricFilter;
	warningsCount: logs.MetricFilter;
	apiResponseTime: logs.MetricFilter;

	dimensionsMap: Record<string, string>;
	customMetricsNamespace: string;
}

export const defineCommonEcsAppMetricFilters = (
	stack: Stack,
	{
		stackPrefix,
		logGroup,
		customMetricsPrefix,
		customMetricsNamespace = 'CustomMetrics',
	}: DefineCommonEcsAppMetricFiltersProps
): DefineCommonEcsAppMetricFiltersResult => {
	const metricIdPrefix = [stackPrefix, customMetricsPrefix].filter(Boolean).join('-');

	const dimensions: Record<string, string> = {
		// TODO uncomment when aws metric filter will support static-value dimensions
		// https://github.com/aws-cloudformation/aws-cloudformation-resource-providers-logs/issues/64#issuecomment-1714555385
		// AppArn: applicationArn,
		// AppName: applicationName,
		// LogGroupName: logGroup.logGroupName,
	};

	const errorsCount = new logs.MetricFilter(stack, `${metricIdPrefix}-logs-err-count`, {
		filterName: `Errors Count`,
		metricNamespace: customMetricsNamespace,
		metricName: `${metricIdPrefix}-logs-err-count`,
		logGroup,
		filterPattern: logs.FilterPattern.stringValue('$.level', '=', 'error'),
		metricValue: '1',
		unit: cloudwatch.Unit.COUNT,
		// dimensions,
	});

	const warningsCount = new logs.MetricFilter(stack, `${metricIdPrefix}-logs-warn-count`, {
		filterName: `Warnings Count`,
		metricNamespace: customMetricsNamespace,
		metricName: `${metricIdPrefix}-logs-warn-count`,
		logGroup,
		filterPattern: logs.FilterPattern.stringValue('$.level', '=', 'warning'),
		metricValue: '1',
		unit: cloudwatch.Unit.COUNT,
		// dimensions,
	});

	const apiResponseTime = new logs.MetricFilter(
		stack,
		`${[stackPrefix, customMetricsPrefix].filter(Boolean).filter(Boolean).join('-')}-logs-api-response-time`,
		{
			filterName: `Api Response Time`,
			metricNamespace: customMetricsNamespace,
			metricName: `${metricIdPrefix}-logs-api-response-time`,
			logGroup,
			filterPattern: logs.FilterPattern.all(
				logs.FilterPattern.stringValue('$.path', '=', '*/api/*'),
				logs.FilterPattern.stringValue('$.path', '!=', '*/api/health*')
			),
			metricValue: '$.responseTime',
			unit: cloudwatch.Unit.MILLISECONDS,
			// dimensions,
		}
	);

	return {
		errorsCount,
		warningsCount,
		apiResponseTime,
		dimensionsMap: dimensions,
		customMetricsNamespace,
	};
};
