function goAgain(event) {
  // event.preventDefault();
  event.stopPropagation();

  $('#c').remove();
  $('.final-screen').hide();
  currentTesterIndex = -1;
  resetProgress(currentSection);
  nextTester();
}

function nextTester() {
  var imagePath =  'http://lesson.smartstart.today/static/images/do-you-speak.jpg';
  currentTesterIndex += 1;

  if (currentTesterIndex === 0) {
    clearPreviousProgress();
  }

  if (currentTesterIndex === currentSection.testers.length) {
    currentTesterIndex = 0; //Dirty stuff, just to make next increment result to 0

    var succeededTests = progressService.getNumberOfCompletedTests(currentSection.testersResults);
    var allTests = currentSection.testers.length;

    $('.dnd-tester, .ru-en-tester, .listening-tester1, .listening-tester2, .listening-tester3').hide();
    $('.final-screen').show();
    $('.result-container').html(`
        <div class="result"> Ваш результат
          <div class="ml15">
            <span class="word"> ${succeededTests} </span>
            <span class="word of"> из </span>
            <span class="word"> ${allTests} </span>
          </div>
        </div>`);

    $('#vk-share')[0].addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.getElementById('shareBtn').onclick = function() {
      FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        mobile_iframe: true,
        display: 'popup',
        action_properties: JSON.stringify({
          object: {
            'og:url': 'http://smartstart.today/english-in-90-days/',
            'og:title': `Сегодня я прошёл тест на ${succeededTests} из ${allTests}.`,
            // 'og:description': 'The description',
            'og:image': imagePath,
            'og:image:width': 400,
            'og:image:height': 400
          }
        })
      }, function(response){
      });
    };

    // animated words for showing result
    anime.timeline({loop: false})
        .add({
          targets: '.ml15 .word',
          scale: [14,1],
          opacity: [0,1],
          easing: "easeOutCirc",
          duration: 800,
          delay: function(el, i) {
            return 800 * i;
          }
        }).add({
      targets: '.ml15',
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });

    fireworkAnimation();
    setTimeout(addBlinkText, 5000);


    function addBlinkText () {
      $('.share-text')[0].className += ' blink-text';
      $('.final-screen').off('touchstart');
    }

  } else {
    drawTester(currentSection.testers[currentTesterIndex]);
    progressService.testerStarts(sections, lessonKey, currentSection, currentTesterIndex);
  }
}

function clearPreviousProgress() {
  currentSection.testersResults = progressService.createEmptyTestsResults(currentSection.testers);
  progressService.saveSectionsState(sections, lessonKey);
}