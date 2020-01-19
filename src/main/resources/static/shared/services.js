var cleanUpOnFullLocalStorageService = {
    hasItem: function (key) {
        return localStorage.getItem(key) !== null
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    getJSONItem: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    setItem: function (key, value) {
        try {
            localStorage.setItem(key, value);
        } catch(e) {
            if (isQuotaExceeded(e)) {
                console.log('Local storage is full, do cleanup');
                localStorage.clear();
                localStorage.setItem(key, value);
            }
        }
    },
    clear: function () {
        localStorage.clear();
    }
};

cleanUpOnFullLocalStorageService.checkVersion = function (version) {
    if (!cleanUpOnFullLocalStorageService.hasItem("version") || cleanUpOnFullLocalStorageService.getItem("version") !== version) {
        // If we didn't push version yet, or existing does not corresponds server version: clear local storage and write version
        // TODO : think about do we can be trapped in situation when JSON in localStorage is invalid but version is OK
        cleanUpOnFullLocalStorageService.clear();
        cleanUpOnFullLocalStorageService.setItem("version", version);
    }
};

function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
        if (e.code) {
            switch (e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014:
                    // Firefox
                    if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if (e.number === -2147024882) {
            // Internet Explorer 8
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}

var localStorageService = cleanUpOnFullLocalStorageService;


var lessonService = {};

lessonService.getLessonTitle = function (lessonKey) {
    var lesson = localStorageService.getJSONItem(lessonKey);
    return lesson.lessonData.lessonTitle;
};


/**
 * Object that will be stored in localStorage:
 * {
 *   lessonData: {},
 *   lessonConfigurationData: {},
 *   lessonResultsData: {}
 * }
 */

var progressService = {};

progressService._createCurrentLessonResultsData = function (sections) {
    var progressState = {
        s: undefined, // Means section.id of section where previous unfinished test was, or undefined if user did not stopped on half way,
        t: undefined, // Means tester index which was not completed
        progress: []
    };

    sections.forEach(function (section) {
        var results = [];

        section.testersResults.forEach(function (result) {
            if (result === null) results.push(-1);
            else if (result == true) results.push(1);
            else results.push(0);
        });

        progressState.progress.push({
            i: section.id, // Section id
            r: results     // Results, where -1 means not touched, 0 failed and 1 passed
        });
    });

    return progressState;
};

progressService._saveProgressState = function (lessonKey, lessonResultsData) {
    var lesson = localStorageService.getJSONItem(lessonKey);
    lesson.lessonResultsData = lessonResultsData;
    localStorageService.setItem(lessonKey, JSON.stringify(lesson));
};

progressService.testerStarts = function (sections, lessonKey, currentSection, testerId) {
    var lessonResultsData = progressService._createCurrentLessonResultsData(sections);
    lessonResultsData.s = currentSection.id;
    lessonResultsData.t = testerId;

    progressService._saveProgressState(lessonKey, lessonResultsData);
};

progressService.saveSectionsState = function (sections, lessonKey) {
    var lessonResultsData = progressService._createCurrentLessonResultsData(sections);
    // Typically this method calls whenever test is failed/succeeded, which automatically means it's over
    lessonResultsData.s = undefined;
    lessonResultsData.t = undefined;

    progressService._saveProgressState(lessonKey, lessonResultsData);
};

progressService.setResultForLatestTester = function (sections, lessonKey, currentSection, testerId, result) {
    currentSection.testersResults[testerId] = result;

    progressService.saveSectionsState(sections, lessonKey);
};

progressService.getNumberOfCompletedTests = function (testersResults) {
    return testersResults.reduce(function (acc, val) {
        return val ? acc + 1 : acc;
    }, 0);
};

progressService.createEmptyTestsResults = function (testers) {
    return testers.map(function () { return null; });
};




var sectionsService = {};

sectionsService.createSectionsFromStoredConfiguration = function (lessonKey) {
    var lesson = localStorageService.getJSONItem(lessonKey);

    var sections = [];

    lesson.lessonData.lessonTasks.forEach(function (task) {
        var loadedTask = lesson.lessonConfigurationData.find(function (t) { return t.taskId == task.taskId; });
        var loadedTaskResults = lesson.lessonResultsData.progress.find(function (t) { return t.i == task.taskId});
        var testersResults = [];

        if (loadedTaskResults !== undefined) {
            testersResults = loadedTaskResults.r.map(function (v) {
                if (v == -1) return null;
                else if (v == 0) return false;
                else return true;
            });
        }

        if (loadedTask !== undefined) {
            sections.push({
                id: task.taskId,
                title: task.title,
                testers: [],
                testersResults: testersResults
            });

            loadedTask.testers.forEach(function (loadedTaskTester) {
                var concreteTester = task.testers[loadedTaskTester.t].testers[loadedTaskTester.c];
                var concreteAlternative = concreteTester.alternatives[loadedTaskTester.a];
                var tester = {type: loadedTaskTester.t, timeout: concreteTester.timeout};

                $.extend(tester, concreteAlternative);

                sections[sections.length - 1].testers.push(tester);
                if (loadedTaskResults === undefined) sections[sections.length - 1].testersResults.push(null);
            });
        }
    });

    return sections;
};

sectionsService.createSectionsFromLoadedConfiguration = function (lessonData, lessonKey) {
    var lesson = {
        lessonData: lessonData,
        lessonConfigurationData: undefined,
        lessonResultsData: {
            progress: []
        }
    };

    var sections = [];
    var lessonConfigurationData = [];

    lessonData.lessonTasks.forEach(function (task) {
        sections.push({
            id: task.taskId,
            title: task.title,
            testers: [],
            testersResults: []
        });

        lessonConfigurationData.push({
            taskId: task.taskId,
            testers: []
        });

        var testersOfTask = [];
        var testersTypes = [];

        Object.keys(task.testers).forEach(function (testerType) {
            testersTypes.push(testerType);

            var randomTestersFromPool = takeRandomElements(task.testers[testerType].testers, task.testers[testerType].numberOfTestersToPick);

            randomTestersFromPool.forEach(function (concreteTester) {
                var alternativeIndex = Math.floor(Math.random() * concreteTester.alternatives.length);
                var concreteAlternative = concreteTester.alternatives[alternativeIndex];
                var tester = { type: testerType, timeout: concreteTester.timeout };

                $.extend(tester, concreteAlternative);

                testersOfTask.push({
                    testerForSection: tester,
                    testerForLocalStorage: {
                        // Weird names for compactness
                        t: testerType, // Tester type
                        c: concreteTester.concreteTesterIdOfType, // Index of concrete tester
                        a: alternativeIndex // Index of alternative
                    }
                });
            });
        });

        if (!arrayContains(testersTypes, LISTENING_TESTERS)) {
            // If task testers does not contains listening testers, then we can shuffle them
            shuffleArray(testersOfTask);
        }

        testersOfTask.forEach(function (o) {
            sections[sections.length - 1].testers.push(o.testerForSection);
            sections[sections.length - 1].testersResults.push(null);

            lessonConfigurationData[lessonConfigurationData.length - 1].testers.push(o.testerForLocalStorage);
        });
    });

    lesson.lessonConfigurationData = lessonConfigurationData;

    localStorageService.setItem(lessonKey, JSON.stringify(lesson));

    return sections;
};

sectionsService.getUncompletedInProgressData = function (lessonKey) {
    if (localStorageService.hasItem(lessonKey)) {
        var lesson = localStorageService.getJSONItem(lessonKey);

        if (lesson.lessonResultsData) {
            return {
                sectionIdToStartWith: lesson.lessonResultsData.s,
                testerIndexToStartWith: lesson.lessonResultsData.t
            };    
        }
    }

    return {
        sectionIdToStartWith: undefined,
        testerIndexToStartWith: undefined
    };

};

function takeRandomElements(array, n) {
    if (!n || n <= 0 || n >= array.length) {
        return array;
    } else {
        var clonedArray = array.slice();
        var newArray = [];
        for (var i = 0; i < n; i++) {
            var randomIndex = Math.floor(Math.random() * clonedArray.length);
            newArray.push(clonedArray.splice(randomIndex, 1)[0]);
        }
        return newArray;
    }
}

function shuffleArray(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
}

function arrayContains(array_to_search_in, array) {
    return array.some(function (v) {
        return array_to_search_in.indexOf(v) >= 0;
    });
}