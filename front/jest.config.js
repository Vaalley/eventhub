/** @type {import('jest').Config} */
export default {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	testMatch: ['**/*.test.ts'],
}
