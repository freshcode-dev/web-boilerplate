import { Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as ecs from 'aws-cdk-lib/aws-ecs';

/**
 * Registers a full set of resources required for adding a volume to ECS container.
 * What it creates:
 * - EFS Storage, which will be used as a persistent storage to connect to volume
 * - EFS Mount Target in the same subnet as the ECS service (It's important, as otherwise service will not be able to connect)
 * - optionally, EFS Access Point, when used from container with non-root user
 *
 * If you know your container uses a custom user instead of a root, set useCustomPosixUser is set to true.
 * When useCustomPosixUser is true, registers an access point which allows non-root users to access the volume data
 *
 * !!! IMPORTANT !!!
 * After the resources are defined, make sure to add volume to task definition volumes list, and call addMountPoints on the container
 */
export const defineEfsStorageForVolume = (stack: Stack,
																					resourcesPrefix: string,
																					params: SystemOverviewDashboardParams) => {
	const efsName = `${resourcesPrefix}-storage`;
	const efsStorage = new efs.CfnFileSystem(stack, efsName, {
		throughputMode: 'bursting',
		performanceMode: 'generalPurpose',
		availabilityZoneName: params.subnet.availabilityZone,
		lifecyclePolicies: [
			{ transitionToIa: 'AFTER_7_DAYS' },
			{ transitionToPrimaryStorageClass: 'AFTER_1_ACCESS' }
		],
		fileSystemTags: [
			{ key: 'Name', value: efsName }
		],
		encrypted: false,
		bypassPolicyLockoutSafetyCheck: false,
		backupPolicy: {
			status: 'DISABLED',
		},
	});

	const mountTargetName = `${resourcesPrefix}-mount-target`;
	const efsMountTarget = new efs.CfnMountTarget(stack, mountTargetName, {
		fileSystemId: efsStorage.attrFileSystemId,
		securityGroups: [params.securityGroup.securityGroupId],
		subnetId: params.subnet.subnetId
	});
	// Make access point with root directory to make sure it's owned by 1001 user the redis container uses
	let efsAccessPoint: efs.CfnAccessPoint | null = null;


	if (params.useCustomPosixUser) {
		const accessPointName = `${resourcesPrefix}-access-point`;
		efsAccessPoint = new efs.CfnAccessPoint(stack, accessPointName, {
			fileSystemId: efsStorage.attrFileSystemId,
			accessPointTags: [{ key: 'Name', value: accessPointName }],
			rootDirectory: {
				path: params.volumePath, creationInfo: {
					ownerGid: params.posixGroupId, ownerUid: params.posixUserId, permissions: params.posixCreationPermissions
				}
			},
			posixUser: {
				gid: params.posixGroupId, uid: params.posixUserId
			}
		});
	}

	const volume: ecs.Volume = {
		name: params.volumeName,
		efsVolumeConfiguration: {
			fileSystemId: efsStorage.attrFileSystemId,
			transitEncryption: 'ENABLED',
			authorizationConfig: {
				accessPointId: efsAccessPoint?.attrAccessPointId
			}
		},
	};

	return {
		efsStorage,
		efsMountTarget,
		volume
	}
}



export type SystemOverviewDashboardParams = {
		vpc: ec2.IVpc,
		subnet: ec2.ISubnet,
		securityGroup: ec2.ISecurityGroup,
		volumeName: string,
		volumePath: string, // '/bitnami/redis/data'
	}
	& (WithRootUserProps | WithCustomPosixUserProps);

type WithCustomPosixUserProps = {
	useCustomPosixUser: true,
	posixUserId: string,
	posixGroupId: string,
	posixCreationPermissions: string
};

type WithRootUserProps = {
	useCustomPosixUser: false
};
