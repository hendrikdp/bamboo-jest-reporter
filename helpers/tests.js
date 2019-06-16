function add(results, report){
    //iterate test suites
    for(let testSuite of results.testResults){
        addTestSuiteResult(testSuite, report);
    }
}

function addTestSuiteResult(testSuite, report){
    //iterate tests
    for(let test of testSuite.testResults){
        const collection = report[test.status];
        if(collection instanceof Array){
            collection.push(addTestResult(testSuite, test));
        }
    }
}

function addTestResult(testSuite, test){
    return {
        title: test.title,
        fullTitle: `${test.ancestorTitles} ${test.title}`,
        duration: testSuite.perfStats.end - testSuite.perfStats.start,
        errorCount: test.failureMessages.length,
        error: test.failureMessages.length > 0 ? test.failureMessages.join(`\n`) : undefined
    };
}

module.exports = {add};