const nxPreset = require('@nrwl/jest/preset');

module.exports = {
	...nxPreset,
	codeCoverage: true,
	coverageDirectory: '__coverage__',
	reporters: [
		"default",
		["jest-junit", {"outputDirectory": "__reports__", "outputName": "report.xml"}]
	]
};
