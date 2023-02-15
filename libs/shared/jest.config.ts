/* eslint-disable */
export default {
  displayName: 'shared',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/shared',
	coverageReporters: [
		["jest-junit", {"outputDirectory": "__reports__", "outputName": "shared.xml"}]
	]
};
