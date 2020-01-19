function TesterTimeout(progressBar, timeout /* in seconds */) {
  var autoProceedScheduled = false;

  progressBar.progressbar({ value: 0});

  var refreshIntervalInMs = 25;
  var progress = 0;
  var progressCapacity = (timeout * 1000) / refreshIntervalInMs;
  var testerFailingTimeoutProgressIntervalId = setInterval(function () {
    progress += 1;
    var value = Math.round((progress * 100) / progressCapacity);
    progressBar.progressbar({ value: value});

    if (value === 100) {
        playFail();

        progressService.setResultForLatestTester(sections, lessonKey, currentSection, currentTesterIndex, false);
        drawProgress(currentSection.testersResults);

        clearInterval(testerFailingTimeoutProgressIntervalId);
        !autoProceedScheduled && setTimeout(nextTester, AUTO_PROCEED_DELAY);
        autoProceedScheduled = true;
    }
  }, refreshIntervalInMs);

  return {
    testerAnswered: function (result) {
      if (result) {
        playSuccess()
      } else {
        playFail()
      }

      progressService.setResultForLatestTester(sections, lessonKey, currentSection, currentTesterIndex, result);
      drawProgress(currentSection.testersResults);

      clearInterval(testerFailingTimeoutProgressIntervalId);
      !autoProceedScheduled && setTimeout(nextTester, AUTO_PROCEED_DELAY);
      autoProceedScheduled = true;
    }
  }
}