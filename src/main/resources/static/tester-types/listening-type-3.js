function listeningTester3(config) {
  $('.tester-header.listening-header3')[0].innerText = config.title;

  var videoContainer = $('.listening-tester3 .video-container');
  videoContainer.empty();
  videoContainer.append($('<iframe width="512" height="288"></iframe>').attr('src', config.videoUrl
      + "?fs=0&rel=0"));

  var sentenceContainer = $('.listening-tester3 .sentence-container');
  sentenceContainer.empty();

  var correctAnswerIdx = 0;
  var emptyParts = [];

  config.sentence.forEach(function (sentencePart) {
    if (sentencePart == null) {
      emptyParts.push(sentencePart);
    }
  });

  config.sentence.forEach(function (sentencePart) {
    if (sentencePart == null) {
        sentenceContainer.append(`<div class="sentence-part-input">
        <select class="listening-input input-select"></select></div>`);

        $('.input-select').each(function(index, possibleAnswerGroup) {
          if ($('.input-select').length === config.possibleAnswers[index].length) {
            for (let i = 0; i < config.possibleAnswers[index].length; i++) {
              var el = document.createElement('option');
              el.innerText = config.possibleAnswers[index][i].text;
              el.setAttribute('value', config.possibleAnswers[index][i].text);
              possibleAnswerGroup.appendChild(el);
            }
          }
        });
        correctAnswerIdx += 1;

    } else {
      sentenceContainer.append('<div class="sentence-part">' + sentencePart + '</div>');
    }
  });

  var testerTimeout = TesterTimeout($('.listening-tester3 .tester-progressbar:first'), Infinity);
  var submitBtn = $('#listening3-submit');
  var answers = [];

  submitBtn.on('click', function () {
    var answers = [];
    for (let i = 0; i < $('.input-select').length; i++) {
      $('.input-select')[i].style.pointerEvents = 'none';
      answers.push($('.input-select')[i].selectedOptions[0].value);
    }

    for(var i = 0; i < answers.length; i++) {
        if (answers[i] === config.correctAnswer[i]) {
          if ($('.input-select')[i].selectedOptions[0].value === config.correctAnswer[i]) {
            $('.input-select')[i].style.backgroundColor = '#39C02B';
          }
      } else {
          $('.input-select')[i].style.backgroundColor = '#c0392b';
        }
    }

    var isAnswerCorrect = (JSON.stringify(answers) === JSON.stringify(config.correctAnswer));
    // if (isAnswerCorrect) {
    //   this.style.backgroundColor = '#39C02B';
    // } else {
    //   this.style.backgroundColor = '#c0392b';
    // }

    testerTimeout.testerAnswered(isAnswerCorrect);
  });
}