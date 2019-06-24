function add(coverageResult, thresholds, report) {
    try{
        const coverageSummary = coverageResult.getCoverageSummary();
        if(typeof thresholds === `object`){
            for(let thresholdCategory in thresholds){
                const reachedPct = coverageSummary && coverageSummary.data && coverageSummary[thresholdCategory] && coverageSummary[thresholdCategory].pct;
                const isThresholdMet = reachedPct >= thresholds[thresholdCategory];
                report[isThresholdMet ? `passed` : `failed`].push({
                    title: `Then ${thresholdCategory} should meet ${thresholds[thresholdCategory]}% coverage`,
                    fullTitle: `When testing code-coverage Then ${thresholdCategory} should meet ${thresholds[thresholdCategory]}% coverage`,
                    duration: 0,
                    errorCount: isThresholdMet ? 0 : 1,
                    error: isThresholdMet ? undefined : `Coverage for ${thresholdCategory}: ${reachedPct}%, while ${thresholdCategory} should be ${thresholds[thresholdCategory]}% covered!`
                });
            }
        }
    }catch(err){
        console.warn(err);
    }
}

module.exports = {add};

