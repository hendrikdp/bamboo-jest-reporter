/*global process, module*/
module.exports = {
	bail: true,
	browser: false,
	verbose: true,
	collectCoverage: true,
	cache: false,
	coverageDirectory: `coverage`,
	collectCoverageFrom: [
		`**/*.js`,
        `!**/coverage*/**`,
		'!jest.config.js'
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			statements: 80,
			lines: 80
		}
	}
};
