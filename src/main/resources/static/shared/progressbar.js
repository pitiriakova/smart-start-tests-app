function resetProgress(currentSection) {
  $('.tests-progress').each(function (idx, e) {
    var progressContainer = $(e);
    progressContainer.empty();
    currentSection.testers.forEach(function () {
      progressContainer.append('<div></div>');
    });
  });
}

function drawProgress(concreteSectionTestersResults) {
  // Draw progress
  $('.tests-progress').each(function (idx, e) {
    var progressContainer = $(e);

    progressContainer.find('div').each(function (divIndex, div) {
      if (concreteSectionTestersResults[divIndex] === null) {
        div.classList = '';
      } else if (concreteSectionTestersResults[divIndex]) {
        div.classList = 'success';
      } else {
        div.classList = 'fail';
      }
    });
  })
}