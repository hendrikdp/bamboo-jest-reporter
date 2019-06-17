# Bamboo jest reporter
An Atlassian Bamboo reporter for Jest tests. 

This reporter will generate test results for:
* Jest tests
* Coverage
* Obsolete snapshots

Tests / coverage / snapshots can be separately disabled by environment variables:
* JEST_REPORTER_ADD_TESTS=false (only report coverage and/or obsolete snapshots)
* JEST_REPORTER_ADD_COVERAGE=false (do not report coverage drops)
* JEST_REPORTER_SNAPSHOTS_ADD_OBSOLETE=false (do not report obsolete snapshots as a failure)

This project was started based on https://github.com/adalbertoteixeira/jest-bamboo-formatter

# Installation
Install and add the reporter to the development dependencies in package.json:
```
npm i bamboo-jest-reporter --save-dev
```

# Configuration
##### Configure an npm test script for your project
Add the test npm script in your package.json
```
"scripts": {
    "test": "jest"
}
```
#### Jest configruation
Configuring Jest can be done either in a configuration file (default:'jest.config.js') or in 'package.json':
https://jestjs.io/docs/en/configuration

#### Add reporter
Add the following line to your configuration to add this reporter:
```
reporters: [ "bamboo-jest-reporter" ],
```
If you want to preserve the default Jest reporters:
```
reporters: [ "defaults", "bamboo-jest-reporter" ],
```
#### Add coverage thresholds
To add code coverage thresholds, add the following block to the configuration:
```
coverageThreshold: {
    global: {
        branches: 100,
        functions: 100,
        statements: 100,
        lines: 100
    }
},
```
##### Make Jest output coverage info
To include coverage: simply collectCoverage to the Jest config
```
collectCoverage: true
```
Or configure npm test to collect coverage as well
```
"scripts": {
    "test": "jest --coverage"
}
```
#### Sample configurations
##### jest.config.js
```
module.exports = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	reporters: [ "defaults", "bamboo-jest-reporter" ],
	collectCoverageFrom: [
		"**/*.js"
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			statements: 100,
			lines: 100
		}
	}
}
```
##### Alternative: package.json
```
jest: {
	collectCoverage: true,
	coverageDirectory: "coverage",
	reporters: [ "defaults", "bamboo-jest-reporter" ],
	collectCoverageFrom: [
		"**/*.js"
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			statements: 100,
			lines: 100
		}
	}
}
```

# Usage
A mocha test report will be created (jest.json) after running:
```
npm test
```
You can disable:
* reporting of Jest test-results: set an environment variable in your bamboo task JEST_REPORTER_ADD_TESTS=false
* reporting of coverage: set an environment variable in your bamboo task JEST_REPORTER_ADD_COVERAGE=false
* reporting of obsolete snapshots: set an environment variable in your bamboo task JEST_REPORTER_SNAPSHOTS_ADD_OBSOLETE=false

By default tests / coverage and obsolete snapshots are all reported. When all reporting is on, the following scenarios will be logged as failures:
* When a Jest test fails
* When the coverage thresholds are not met (only when configured in the jest-configuration)
* When obsolete snapshots are found (if Jest snapshots are configured)

Prevent your Bamboo task from failing when the tests fail (exit 0):
```
#!/usr/bin/env bash
if ! npm test
then
    echo "The automated jest tests did not pass. Please check the tests-tab"
    exit 0
fi
```

Make Bamboo fail by interpreting the test-results:

Add a 'Mocha Test Parser'-task to your bamboo-job. Set 'jest.json' as testfile pattern.
