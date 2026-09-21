/*
  Work page: draws one section per category, with its entries underneath.
  Filled from content/work.md. You should not need to edit this file.
*/
(function () {
  'use strict';

  var root = document.body.getAttribute('data-root') || './';
  var main = document.getElementById('work');

  Work.load(root).then(function (categories) {
    var html = '';
    categories.forEach(function (c) {
      if (!c.entries.length) return;
      html += '<section>';
      if (c.title) {
        html += '<div class="rail"><h2>' + Work.inline(c.title) + '</h2></div>';
      }
      html += '<ul class="entries">';
      c.entries.forEach(function (e) { html += '<li>' + e.html + '</li>'; });
      html += '</ul></section>';
    });
    main.innerHTML = html || '<p class="note">Nothing here yet. Add entries to content/work.md.</p>';
  }).catch(function (err) {
    main.innerHTML = '<p class="note">Could not load the publications (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file. See README.md.</p>';
  });
})();
