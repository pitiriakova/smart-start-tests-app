function drawTester(tester) {

  var dndTesterElement = $('.dnd-tester');
  var ruEnTesterElement = $('.ru-en-tester');
  var listeningTester1Element = $('.listening-tester1');
  var listeningTester2Element = $('.listening-tester2');
  var listeningTester3Element = $('.listening-tester3');


  dndTesterElement.hide();
  ruEnTesterElement.hide();
  listeningTester1Element.hide();
  listeningTester2Element.hide();
  listeningTester3Element.hide();
  $('.final-screen').hide();

  var configuration = tester;
  if (configuration.type === 'dnd') {
    dndTester(configuration);
    dndTesterElement.show();
  } else if (configuration.type === 'ru-en') {
    ru_enTester(configuration);
    ruEnTesterElement.show();
  } else if (configuration.type === 'listening1') {
    listeningTester1(configuration);
    listeningTester1Element.show();
  }
  else if (configuration.type === 'listening2') {
    listeningTester2(configuration);
    listeningTester2Element.show();
    // Completely not nice, but for the moment dunno how to do
    $('.listening-tester2 .answer-container input').focus();
  } else if (configuration.type === 'listening3') {
    listeningTester3(configuration);
    listeningTester3Element.show();
  }
}