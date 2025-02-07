/* eslint-disable */
export default {
  displayName: 'data',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/data',
	coverageReporters: [
		["jest-junit", {"outputDirectory": "__reports__", "outputName": "data.xml"}]
	]
};
