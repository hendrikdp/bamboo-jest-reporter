function addObsolete(snapshot, report){
    if(snapshot.uncheckedKeysByFile instanceof Array){
        for(let uncheckedFile of snapshot.uncheckedKeysByFile){
            addUncheckedFile(uncheckedFile, report);
        }
    }
}

function addUncheckedFile(file, report){
    for(let key of file.keys){
        addUncheckedKey(file, key, report);
    }
}

function addUncheckedKey(file, key, report){
    report.failed.push({
        title: key,
        fullTitle: `Obsolete snapshot: ${key}`,
        duration: 0,
        errorCount: 1,
        error: `Obsolete snapshot ${key} in file ${file.filePath}`
    });
}

module.exports = {addObsolete};