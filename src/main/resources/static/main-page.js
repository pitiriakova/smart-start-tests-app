function renderMainPage(sections, menuName) {
  var mainMenu = $('.main-menu');

  mainMenu.append('<div class="menu-name">' + menuName + '</div>');
  
  if (sections.length == 0) {
      mainMenu.append('<h1>' + 'No configuration found' + '</h1>');
      return;
  }

  sections.forEach(function (section) {
    mainMenu.append('<div class="item-menu" data-section-id="' + section.id + '"><div class="section-title">' + section.title + '</div></div>')
  });

  mainMenu.find('div.item-menu').on('click', function (event) {
    event.stopPropagation();
    var sectionId = $(this).attr('data-section-id');
    selectSection(sections, sectionId, 0, true);
  });
}

function selectSection (sections, sectionId, testerIndex, clearProgress) {
  currentTesterIndex = testerIndex;

  sections.find(function (section) {
    if (sectionId == section.id) {
      currentSection = section;
      if (clearProgress) clearPreviousProgress();
      $('.main-page').hide();
      // First draw progress - empty grey circles
      resetProgress(currentSection);
      drawProgress(currentSection.testersResults);
      // Then draw tester itself
      drawTester(currentSection.testers[testerIndex]);
    }
  })
}
