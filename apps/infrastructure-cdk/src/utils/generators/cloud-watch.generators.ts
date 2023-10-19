import { Stack } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export const defineCommonEcsAppMetricFilters = (
	stack: Stack,
	{
		stackPrefix,
		dashboardPrefix,
		logGroup,
		customMetricsNamespace = 'CustomMetrics',
		customMetricsPrefix,
	}: {
		dashboardPrefix?: string;
		applicationArn: string;
		applicationName: string;
		logGroup: logs.LogGroup;
		customMetricsNamespace?: string;
		customMetricsPrefix: string;
		stackPrefix: string;
	}
) => {
	const dimensions = { // TODO uncomment when aws metric filter will support static-value dimensions
		// AppArn: applicationArn,
		// AppName: applicationName,
		// LogGroupName: logGroup.logGroupName,
	};

	const errorsCount = new logs.MetricFilter(stack, `${[stackPrefix, customMetricsPrefix].join('-')}-logs-err-count`, {
		filterName: `Errors Count${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
		metricNamespace: customMetricsNamespace,
		metricName: `${[stackPrefix, customMetricsPrefix].join('-')}-logs-err-count`,
		logGroup,
		filterPattern: logs.FilterPattern.stringValue('$.level', '=', 'error'),
		metricValue: '1',
		unit: cloudwatch.Unit.COUNT,
		// dimensions,
	});

	const warningsCount = new logs.MetricFilter(
		stack,
		`${[stackPrefix, customMetricsPrefix].join('-')}-logs-warn-count`,
		{
			filterName: `Warnings Count${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
			metricNamespace: customMetricsNamespace,
			metricName: `${[stackPrefix, customMetricsPrefix].join('-')}-logs-warn-count`,
			logGroup,
			filterPattern: logs.FilterPattern.stringValue('$.level', '=', 'warning'),
			metricValue: '1',
			unit: cloudwatch.Unit.COUNT,
			// dimensions,
		}
	);

	const apiResponseTime = new logs.MetricFilter(
		stack,
		`${[stackPrefix, customMetricsPrefix].join('-')}-logs-api-response-time`,
		{
			filterName: `Api Response Time${dashboardPrefix ? ` (${dashboardPrefix})` : ''}`,
			metricNamespace: customMetricsNamespace,
			metricName: `${[stackPrefix, customMetricsPrefix].join('-')}-logs-api-response-time`,
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
	};
};
