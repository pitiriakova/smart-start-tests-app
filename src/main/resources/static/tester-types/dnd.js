function dndTester(config, reloaded) {
  /*first tester starts*/
  var reloaded = reloaded || false;
  var secondLineWords = [];

  var firstLineEls = $('.first-line');
  var secondLineEls = $('.second-line');

  var title = $('.tester-header.dnd-header');
  title[0].innerHTML = config.title;

  $('.reset-button').attr("disabled", false);

  // Without it on resolution ~1400px sentence `You shall not pass` does not fit the screen horizontally
  var cardMaxWidth = Math.round(72 / config.firstLineWords.length);
  var cardStyle = 'style="width: ' + cardMaxWidth + 'rem"';

  firstLineEls.empty();
  secondLineEls.empty();
  config.firstLineWords.forEach(function (word) {
    firstLineEls.append('<div class="first-line-item not-moved" '+cardStyle+'><span class="card-item" '+cardStyle+'>' + word + '</span></div>');
    secondLineEls.append('<div class="second-line-item" '+cardStyle+'><div class="card-item-droppable card-item-empty" '+cardStyle+'></div></div>')
  });

  /* Onclick implementation for mobile devices */
  if ( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
  var currentDraggable;
    var currentDraggableParent;

    firstLineEls.find('.card-item').on('click', function (draggableElement) {
      currentDraggable = draggableElement.currentTarget;
      currentDraggableParent = draggableElement.currentTarget.parentElement;
      if (currentDraggableParent.style.backgroundColor = 'rgb(255, 240, 99)') {
        unselectAll();
      }
      selectElement(currentDraggableParent);

      var droppableElement = secondLineEls.find('.card-item-droppable.card-item-empty');
      droppableElement.each(function (index, el) {
        if (el.innerText === '') {
          selectElement(el);
        }

        el.addEventListener('click', function () {

          if(el.innerText !== '') {
            currentDraggable.innerText = '';
            return false;
          } else {
            el.innerText = currentDraggable.innerText;
            currentDraggable.style.display = 'none';
          }

          droppableElement.each(function (index, el) {
            unselectAll();
            checkIfAllCardsDropped()
          });
        });
      });
    });

    function selectElement(el) {
      el.style.backgroundColor = 'rgb(255, 240, 99)';
      el.style.boxShadow = '0 0 0 3px white';
    }

    function removeDraggedEl($event) {
      $('.card-item.ui-draggable').each(function (index, element) {
        if (element.innerText === $event.target.innerText) {
          element.innerText = '';
        }
      });
    };

    function unselectAll () {
      $('.first-line-item').each(function(index, firstLineEl) {
        $('.second-line-item .card-item-droppable').each(function(i, secondLineEl) {
          firstLineEl.style.backgroundColor = '';
          secondLineEl.style.backgroundColor = '';
          firstLineEl.style.boxShadow = 'none';
          secondLineEl.style.boxShadow = 'none';
        })
      });
    }
  }
  /* Onclick implementation for mobile devices ends */

  else {
    firstLineEls.find('.card-item').draggable({
      revert: 'invalid',
      snap: '.card-item-droppable',
      opacity: 0.35,
      preventCollision: true,
      helper: 'original'
    }).droppable({
      grid: [420, 180],
      drop: function ($event, ui) {
        ui.draggable.draggable('option', 'revert', true);
      }
    });

    function removeDraggedEl($event) {
      $('.card-item.ui-draggable').each(function (index, element) {
        if (element.innerText === $event.target.innerText) {
          element.innerText = '';
        }
      });
    };

    secondLineEls.find('.card-item-droppable').droppable({
      drop: function ($event, ui) {
        // var dropableEls = secondLineEls.find('.card-item-droppable');

        var cardOnWhichWordCardIsGoingToBeDropped = $event.target;
        var cardIsEmpty = !cardOnWhichWordCardIsGoingToBeDropped.innerText;

        if (cardIsEmpty) {
          var firstLineCard = $(ui.draggable);
          cardOnWhichWordCardIsGoingToBeDropped.innerText = firstLineCard.text();
          cardOnWhichWordCardIsGoingToBeDropped.classList.remove('card-item-empty');
          firstLineCard.draggable('disable');
          firstLineCard.parent().removeClass('not-moved');
        }
        checkIfAllCardsDropped($event);
      }
    });
  }

  function checkIfAllCardsDropped ($event) {
    var dropableEls = secondLineEls.find('.card-item-droppable');

    dropableEls.each(function (index, element) {
      //if the place to drop is not empty and this word has already been in the array, we can't drop anything there
      if (dropableEls[index].innerText !== '' && secondLineWords.indexOf(dropableEls[index].innerText) === -1) {
        //place the recently dropped word to the correct place un the array
        secondLineWords[index] = dropableEls[index].innerText;
        removeDraggedEl($event);
      }
    });

    var allCardsDropped = false;
    var isAnswerCorrect = false;

    $('.card-item-droppable').each(function (index, element) {
      //remove undefined values from the array
      var secondLineWordsCount = secondLineWords.filter(function (value) {
        return value !== undefined
      }).length;

      for (var i = 0; i < secondLineWords.length; i++) {
        if (secondLineWordsCount === config.correctSentence.length) {
          isAnswerCorrect = checkIfAnswerCorrect(element);
          allCardsDropped = true;
        }
      }
    });

    if (allCardsDropped) {
      $('.reset-button').attr("disabled", true);
      testerTimeout.testerAnswered(isAnswerCorrect);
    }
  }

  var checkIfAnswerCorrect = function (element) {
    var isAnswerCorrect = secondLineWords.toString().toLocaleLowerCase() === config.correctSentence.toString().toLocaleLowerCase();
    isAnswerCorrect ? markAnswerAsCorrectWithMargin(element) : markAnswerAsWrongWithMargin(element);
    return isAnswerCorrect;
  };

  testerTimeout = (reloaded) ? testerTimeout : TesterTimeout($('.dnd-tester .tester-progressbar:first'), 60);

  $('.reset-button').on('click', function () {
    dndTester(config, true);
  });
  /*first tester ends*/
}