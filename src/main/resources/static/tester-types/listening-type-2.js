function listeningTester2(config) {
  var title = $('.tester-header.listening-header2');
  title[0].innerText = config.title;

  var videoContainer = $('.listening-tester2 .video-container');
  videoContainer.empty();
  videoContainer.append($('<iframe width="512" height="288"></iframe>').attr('src', config.videoUrl
      + "?fs=0&rel=0"));

  var sentenceContainer = $('.listening-tester2 .sentence-container');
  sentenceContainer.empty();

  var correctAnswerIdx = 0;
  config.sentence.forEach(function (sentencePart) {
    if (sentencePart == null) {
      sentenceContainer.append('<input class="answer-input"/>');
      correctAnswerIdx += 1;
    } else {
      sentenceContainer.append('<div class="sentence-part">' + sentencePart + '</div>');
    }
  });

  var answerContainerInput = $('.listening-tester2 .answer-input');

  // answerContainerInput.prop('readonly', '');
  answerContainerInput.prop('value', '');
  answerContainerInput.focus();

  var charactersContainer = $('.listening-tester2 .characters-container');
  charactersContainer.empty();
  config.characters.forEach(function (c) {
    charactersContainer.append('<button class="character-button" data-character="' + c + '" tabIndex="-1">' + c + '</button>');
  });
  charactersContainer.append('<button class="reset-button" tabIndex="-1">&#x21bb;</button>');
  charactersContainer.append('<button class="enter-button" tabIndex="-1">Готово</button>');

  var allCharactersButtons = $('.listening-tester2 .characters-container > button');
  var lastCharactersButton = $('.listening-tester2 .characters-container > button:last');

  allCharactersButtons.on('click', function () {
    var character = $(this).attr('data-character');
    if (character) {
      // $('.sentence-part-input').prop('value', answerContainerInput.prop('value') + character);
      answerContainerInput.prop('value', answerContainerInput.prop('value') + character);
    } else {
      // Reset button
      answerContainerInput.prop('value', '');
      answerContainerInput.focus();
    }
  });

  allCharactersButtons.on('keypress', function (event) {
    if (event.which == 13) {
      checkAnswers();
    }
    return false;
  });

  lastCharactersButton.off('click').on('click', function () {
    checkAnswers();
  });

  answerContainerInput.off('change').on('change', function () {
    var typedWord = answerContainerInput.prop('value');
    setTimeout(function () {
      if (typedWord === answerContainerInput.prop('value')) {
        // Means input value has changed and we didn't press reset just right after leaving input
        checkAnswers();
      }
    }, 200);
  });

  answerContainerInput.off('keypress').on('keypress', function (event) {
    if (event.which == 13) {
      checkAnswers();
    }
  });

  var testerTimeout = TesterTimeout($('.listening-tester2 .tester-progressbar:first'), Infinity);

  var alreadyAnswered = false;

  function checkAnswers() {
    if (alreadyAnswered) return;
    
    alreadyAnswered = true;

    var typedWord = answerContainerInput.prop('value');

    var isAnswerCorrect = config.correctAnswer.toLowerCase() === typedWord.toLowerCase();

    if (isAnswerCorrect) {
      answerContainerInput.get(0).style.backgroundColor = '#39C02B';
    } else {
      answerContainerInput.get(0).style.backgroundColor = '#c0392b';
    }

    // After typing/putting answer remove possibility to enter one more character
    allCharactersButtons.each(function (index, element) {
      element.style.pointerEvents = 'none';
    });
    answerContainerInput.prop('readonly', 'readonly');

    testerTimeout.testerAnswered(isAnswerCorrect);
  }
}