const nxPreset = require('@nrwl/jest/preset');

module.exports = {
	...nxPreset,
	codeCoverage: true,
	coverageDirectory: '__coverage__',
	/* TODO: Update to latest Jest snapshotFormat
	 * By default Nx has kept the older style of Jest Snapshot formats
	 * to prevent breaking of any existing tests with snapshots.
	 * It's recommend you update to the latest format.
	 * You can do this by removing snapshotFormat property
	 * and running tests with --update-snapshot flag.
	 * Example: "nx affected --targets=test,e2e --update-snapshot"
	 * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
	 */
	snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
