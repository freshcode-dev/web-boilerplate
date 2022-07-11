const nxPreset = require('@nrwl/jest/preset');

module.exports = {
	...nxPreset,
	codeCoverage: true,
	coverageDirectory: '__coverage__'
};
