function ru_enTester(config) {
  /*second tester starts*/
  var title = $('.tester-header.ru-en-header');
  title[0].innerText = config.title;

  var variantsContainer = $('.variants-to-chose');
  variantsContainer.empty();

  config.variantsToChose.forEach(function(variant) {
    variantsContainer.append('<div class="line"><div>' + variant + '</div></div>');
  });

  variantsContainer.find('.line').on('click', function (event) {
    checkIfVariantIsCorrect(event.target.innerText, event.target);
  });

  var testerTimeout = TesterTimeout($('.ru-en-tester .tester-progressbar:first'), 60);

  function checkIfVariantIsCorrect(answerText, element) {
    var isAnswerCorrect = answerText.toLowerCase() === config.correctAnswer.toLowerCase();
    isAnswerCorrect ? markAnswerAsCorrect(element) : markAnswerAsWrong(element);

    // Disable further selection
    $('.variants-to-chose .line').each(function (index, element) {
      element.style.pointerEvents = 'none';
    });

    testerTimeout.testerAnswered(isAnswerCorrect);
  }
  /*second tester ends*/
}