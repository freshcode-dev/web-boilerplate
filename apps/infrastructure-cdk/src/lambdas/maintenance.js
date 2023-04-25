const { ECS } = require('@aws-sdk/client-ecs');
const { RDS } = require('@aws-sdk/client-rds');

/**
 * @param newState {'start' | 'stop'}
 * @param cluster {string}
 * @param service {string}
 */
const updateEcsService = async (newState, cluster, service) => {
	const ecs = new ECS({});
	const desiredCount = newState === 'start' ? 1 : 0;

	const updateServiceParams = { cluster, service, desiredCount, forceNewDeployment: true };

	console.info({ event: 'updating ecs service...', params: updateServiceParams });
	const updateServiceResponse = await ecs.updateService({ cluster, service, desiredCount, forceNewDeployment: true });
	console.info({ event: 'ecs service updated', response: updateServiceResponse });
}

/**
 * @param newState {'start' | 'stop'}
 * @param DBInstanceIdentifier {string}
 */
const updateRdsInstance = async (newState, DBInstanceIdentifier) => {
	const rds = new RDS({});

	if (newState === 'start') {
		console.info({ event: 'Starting DB instance...', DBInstanceIdentifier });
		await rds.startDBInstance({ DBInstanceIdentifier });
		console.info({ event: 'DB instance started', DBInstanceIdentifier });
	}

	if (newState === 'stop') {
		console.info({ event: 'Stopping DB instance...', DBInstanceIdentifier });
		await rds.stopDBInstance({ DBInstanceIdentifier });
		console.info({ event: 'DB instance stopped', DBInstanceIdentifier });
	}
}

/**
 * @param event { newState: 'start' | 'stop' }
 * @returns {Promise<void>}
 */
exports.handler = async (event) => {
	try {
		const {
			ECS_CLUSTER: ecsCluster = '',
			ECS_SERVICE: ecsService = '',
			RDS_INSTANCE_IDENTIFIER: rdsInstanceIdentifier = ''
		} = process.env;

		console.info({ event: 'Lambda started', params: event });

		const { newState } = event;
		await updateRdsInstance(newState, rdsInstanceIdentifier);
		await updateEcsService(newState, ecsCluster, ecsService);
	} catch (e) {
		console.error('[ERROR]', e);
		throw e;
	}
}
