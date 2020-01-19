function listeningTester1(config) {
  $('.tester-header.listening-header1').html(config.title);

  var videoContainer = $('.listening-tester1 .video-container');
  videoContainer.empty();
  videoContainer.append($('<iframe width="512" height="288"></iframe>').attr('src', config.videoUrl
      + "?fs=0&rel=0"));

  var sentenceContainer = $('.listening-tester1 .sentence-container');
  sentenceContainer.empty();

  var correctAnswerIdx = 0;
  config.sentence.forEach(function (sentencePart) {
    if (sentencePart == null) {
      sentenceContainer.append('<div class="sentence-part-input"><input class="listening-input" type="text" disabled style="max-width: 100px"/></div>');
      correctAnswerIdx += 1;
    } else {
      sentenceContainer.append('<div class="sentence-part">' + sentencePart + '</div>');
    }
  });

  var answerContainer = $('.listening-tester1 .answer-container');
  answerContainer.empty();
  config.possibleAnswers.forEach(function (possibleAnswer) {
    answerContainer.append('<div><input class="listening-input" type="submit" value="' + possibleAnswer + '"/></div>');
  });

  var buttons = $('.listening-tester1 .answer-container input');

  var testerTimeout = TesterTimeout($('.listening-tester1 .tester-progressbar:first'), Infinity);

  buttons.on('click', function () {
    var answer = $(this).prop('value');

    // After choosing answer remove possibility to select another before timer proceeds to next tester
    $.each(buttons, function (idx, b) {
      b.style.pointerEvents = 'none';
    });

    var isAnswerCorrect = answer.toLowerCase() === config.correctAnswer.toLowerCase();
    if (isAnswerCorrect) {
      this.style.backgroundColor = '#39C02B';
    } else {
      this.style.backgroundColor = '#c0392b';
    }

    testerTimeout.testerAnswered(isAnswerCorrect);
  });
}