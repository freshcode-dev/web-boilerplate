import { Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export const defineCommonEcsAppMetricFilters = (stack: Stack,
																								resourcesPrefix: string,
																								logGroup: logs.LogGroup,
																								customMetricsNamespace = 'CustomMetrics') => {
	const errorsCount = new logs.MetricFilter(stack, `${resourcesPrefix}-errors-count`, {
		filterName: 'Errors Count',
		metricNamespace: customMetricsNamespace,
		metricName: `${resourcesPrefix}-errors-count`,
		logGroup,
		filterPattern: logs.FilterPattern.stringValue("$.level", "=", "error"),
		metricValue: "1"
	});

	const warningsCount = new logs.MetricFilter(stack, `${resourcesPrefix}-warnings-count`, {
		filterName: 'Warnings Count',
		metricNamespace: customMetricsNamespace,
		metricName: `${resourcesPrefix}-warnings-count`,
		logGroup,
		filterPattern: logs.FilterPattern.stringValue("$.level", "=", "warning"),
		metricValue: "1",
		unit: cloudwatch.Unit.COUNT
	});

	const apiResponseTime = new logs.MetricFilter(stack, `${resourcesPrefix}-api-response-time`, {
		filterName: 'Api Response Time',
		metricNamespace: customMetricsNamespace,
		metricName: `${resourcesPrefix}-api-response-time`,
		logGroup,
		filterPattern: logs.FilterPattern.all(
			logs.FilterPattern.stringValue("$.path", "=", "*/api/*"),
			logs.FilterPattern.stringValue("$.path", "!=", "*/api/health*")
		),
		metricValue: "$.responseTime",
		unit: cloudwatch.Unit.MILLISECONDS
	});

	return {
		errorsCount,
		warningsCount,
		apiResponseTime
	};
}
