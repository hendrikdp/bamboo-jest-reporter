function add(coverageResult, tresholds, report) {
    try{
        const coverageSummary = coverageResult.getCoverageSummary();
        if(typeof tresholds === `object`){
            for(let tresholdCategory in tresholds){
                const reachedPct = coverageSummary && coverageSummary.data && coverageSummary[tresholdCategory] && coverageSummary[tresholdCategory].pct;
                const isTresholdMet = reachedPct > tresholds[tresholdCategory];
                report[isTresholdMet ? `passed` : `failed`].push({
                    title: `Then ${tresholdCategory} should meet ${tresholds[tresholdCategory]}% coverage`,
                    fullTitle: `When testing code-coverage Then ${tresholdCategory} should meet ${tresholds[tresholdCategory]}% coverage`,
                    duration: 0,
                    errorCount: isTresholdMet ? 0 : 1,
                    error: isTresholdMet ? undefined : `Coverage for ${tresholdCategory}: ${reachedPct}%, while ${tresholdCategory} should be ${tresholds[tresholdCategory]}% covered!`
                });
            }
        }
    }catch(err){
        console.warn(err);
    }
}

module.exports = {add};

