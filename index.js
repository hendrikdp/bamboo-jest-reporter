const fs = require('fs');
const coverage = require('./helpers/coverage.js');
const tests = require('./helpers/tests.js');
const snapshots = require('./helpers/snapshots.js');

module.exports = class{
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
        this._envs = this.getEnvs();
        this._report = {
            stats: {},
            failed: [],
            passed: [],
            pending: []
        };
    }

    onRunComplete(contexts, results) {
        if(!results){
            return null;
        }
        this.setStartStats(results);
        this.addCoverage(results);
        this.addObsoleteSnapshots(results);
        this.addTestResults(results);
        this.setEndStats(results);
        this.writeReport({
            stats: this._report.stats,
            failures: this._report.failed,
            passes: this._report.passed,
            skipped: this._report.pending
        });
        return this;
    }

    getEnvs(){
        return {
            coverage: process.env.JEST_REPORTER_ADD_COVERAGE || process.env.bamboo_JEST_REPORTER_ADD_COVERAGE || true,
            snapshotAddObsolete: process.env.JEST_REPORTER_SNAPSHOTS_ADD_OBSOLETE || process.env.bamboo_JEST_REPORTER_SNAPSHOTS_ADD_OBSOLETE || true,
            test: process.env.JEST_REPORTER_ADD_TESTS || process.env.bamboo_JEST_REPORTER_ADD_TESTS || true,
            filename: process.env.JEST_REPORTER_OUTPUT_FILE || process.env.bamboo_JEST_REPORTER_OUTPUT_FILE || process.env.JEST_FILE || process.env.bamboo_JEST_FILE || `jest.json`
        }
    }

    addCoverage(results){
        if(this.constructor.envToBoolean(this._envs.coverage)){
            const coverageConfig = this.getThresholdConfig();
            if(results.coverageMap && coverageConfig){
                coverage.add(results.coverageMap, coverageConfig, this._report);
            }
        }
    }

    addTestResults(results){
        if(this.constructor.envToBoolean(this._envs.test)){
            tests.add(results, this._report);
        }
    }

    addObsoleteSnapshots(results){
        if(results.snapshot && this.constructor.envToBoolean(this._envs.snapshotAddObsolete)){
            snapshots.addObsolete(results.snapshot, this._report);
        }
    }

    getThresholdConfig(){
        return this._globalConfig && this._globalConfig.coverageThreshold && this._globalConfig.coverageThreshold.global;
    }

    setStartStats(results) {
        this._report.stats.duration = Date.now() - results.startTime;
        this._report.stats.start = new Date(results.startTime);
        this._report.stats.end = new Date();
    }

    setEndStats(results){
        this._report.stats.passes = this._report.passed.length;
        this._report.stats.failures = this._report.failed.length;
        this._report.stats.tests = this._report.stats.passes + this._report.stats.failures;
    }

    writeReport(report){
        fs.writeFileSync(this._envs.filename, JSON.stringify(report, null, 2), `utf8`);
    }

    static envToBoolean(value){
        if(typeof value === 'string'){
            value = value.toLowerCase();
        }
        return (value === 'no' || value === 'false') ? false : value;
    }

};