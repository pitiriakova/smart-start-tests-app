// imports starts
var sections = [];
var configError = "No configuration found.";

var lessonKey = window.location.pathname.replace("/test/", "");

var version = "N/A";
$.ajax({
    type: "GET",
    dataType: "json",
    async: false,
    url: "/version",
    complete: function(response) {
        version = response.responseText;
    }
});

localStorageService.checkVersion(version);

if (localStorageService.hasItem(lessonKey)) {
    sections = sectionsService.createSectionsFromStoredConfiguration(lessonKey);
} else {
    $.ajax({
        type: "GET",
        dataType: "json",
        async: false,
        url: "/tester/config/" + lessonKey,
        complete: function(data) {
            if (data.responseText === configError) {
                sections = [];
            } else {
                sections = sectionsService.createSectionsFromLoadedConfiguration(data.responseJSON, lessonKey);
            }
        }
    });
}

var lessonTitle = lessonService.getLessonTitle(lessonKey);
var uncompletedInProgressData = sectionsService.getUncompletedInProgressData(lessonKey);
var sectionIdToStartWith = uncompletedInProgressData.sectionIdToStartWith;
var testerIndexToStartWith = uncompletedInProgressData.testerIndexToStartWith;

var drawTester = drawTester;
var dndTester = dndTester;
var ru_enTester = ru_enTester;
var listeningTester1 = listeningTester1;
var listeningTester2 = listeningTester2;
var listeningTester3 = listeningTester3;
var TesterTimeout = TesterTimeout;
var nextTester = nextTester;
var fireworkAnimation = fireworkAnimation;
// imports ends

var currentSection;

var AUTO_PROCEED_DELAY = 1000;
var currentTesterIndex = 0;

$(document).ready(function () {
    // to use facebook api
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
      FB.init({
        appId: '367565247116261',
        version: 'v2.3' // or v2.0, v2.1, v2.0
      });
    });

    if (sectionIdToStartWith !== undefined && testerIndexToStartWith !== undefined) {
        // We are able to continue
        selectSection(sections, sectionIdToStartWith, testerIndexToStartWith, false);
    } else {
        renderMainPage(sections, lessonTitle);
    }
});

/*for both testers starts */
function markAnswerAsCorrectWithMargin(element) {
    markAnswerAsCorrect(element);
}

function markAnswerAsWrongWithMargin(element) {
    markAnswerAsWrong(element);
}
function markAnswerAsCorrect(element) {
    element.style.margin = '-2px';
    element.style.border = '2px solid white';
    element.style.backgroundColor = '#39C02B';
    // element.classList.add('mark-as-correct');
}

function markAnswerAsWrong(element) {
    element.style.margin = '-2px';
    element.style.border = '2px solid white';
    element.style.backgroundColor = '#c0392b';

    // $('.variants-to-chose').each((index, el) => {
    //     if (el.innerText === contentList.quizContent[recentlyAnsweredIndex].correctAnswer) {
    //         el.classList.add('mark-as-correct');
    //         el.style.backgroundColor = '#39C02B'
    //     }
    // });
}
/*for both testers ends*/

function goHome (event) {
  // event.preventDefault();
  event.stopPropagation();

    $('.main-menu').html('<div></div>');
    renderMainPage(sections, lessonTitle);
    $('.main-page').show();
    $('.final-screen').hide();
}

function playSuccess() {
    document.getElementById("sound-success").pause();
    document.getElementById("sound-fail").pause();

    document.getElementById("sound-success").currentTime = 0;
    document.getElementById("sound-success").play();
}

function playFail() {
    document.getElementById("sound-success").pause();
    document.getElementById("sound-fail").pause();

    document.getElementById("sound-fail").currentTime = 0;
    document.getElementById("sound-fail").play();
}

