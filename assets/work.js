/*
  Work page: draws one section per category, with its entries underneath.
  Filled from content/work.md. You should not need to edit this file.
*/
(function () {
  'use strict';

  var root = document.body.getAttribute('data-root') || './';
  var main = document.getElementById('work');

  // "Edited books & special issue" -> "edited-books-special-issue" (so a link like /work/#edited-books-special-issue jumps there)
  function slug(text, used, n) {
    var s = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!s) s = 'section-' + n;
    var base = s, i = 2;
    while (used[s]) s = base + '-' + i++;
    used[s] = true;
    return s;
  }

  Work.load(root).then(function (categories) {
    var html = '', used = {}, n = 0;
    categories.forEach(function (c) {
      if (!c.entries.length) return;
      n++;
      var id = slug(c.title || '', used, n);
      html += '<section id="' + id + '">';
      if (c.title) {
        html += '<h2 class="label">' + Work.inline(c.title) + '</h2>';
      }
      html += '<ul class="entries" id="' + id + '-list">';
      c.entries.forEach(function (e) { html += '<li>' + e.html + '</li>'; });
      html += '</ul>';
      // the arrow folds the section away (and unfolds it again)
      html += '<p class="up"><button type="button" class="fold" aria-expanded="true" aria-controls="' + id + '-list"' +
        ' aria-label="Fold this section">&#9650;</button></p>';
      html += '</section>';
    });
    main.innerHTML = html || '<p class="note">Nothing here yet. Add entries to content/work.md.</p>';

    // ▲ folds a section: its publications are hidden and the arrow turns into ▼, which unfolds it again
    main.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.fold');
      if (!btn) return;
      var section = btn.closest('section');
      var list = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      list.hidden = open;
      section.classList.toggle('folded', open);
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.setAttribute('aria-label', open ? 'Unfold this section' : 'Fold this section');
      btn.innerHTML = open ? '&#9660;' : '&#9650;';
      // after folding a long section the page shrinks above you, so bring its label back into view
      if (open && section.getBoundingClientRect().top < 0) section.scrollIntoView();
    });

    // if the address ends in #some-category, scroll to it now that the sections exist
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }).catch(function (err) {
    main.innerHTML = '<p class="note">Could not load the publications (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file.</p>';
  });
})();
