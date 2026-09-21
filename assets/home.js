/*
  Home page: builds the spinning 3D DINO and the floating publications.
  The floating text is filled from content/work.md, so every entry you add
  there appears here automatically. You should not need to edit this file.
*/
(function () {
  'use strict';

  var root = document.body.getAttribute('data-root') || './';

  /* ---------- spinning DINO: a stack of layers gives it depth ---------- */
  (function buildScene() {
    var scene = document.getElementById('scene');
    var layers = 24;
    for (var i = 0; i < layers; i++) {
      var d = document.createElement('div');
      d.className = 'layer ' + (i === 0 || i === layers - 1 ? 'face' : 'side');
      d.style.setProperty('--k', String(i - (layers - 1) / 2));
      d.textContent = 'DINO';
      scene.appendChild(d);
    }
  })();

  /* ---------- bio box: filled from content/bio.md ---------- */
  var bio = document.getElementById('bio');
  Work.loadBio(root).then(function (paragraphs) {
    bio.innerHTML = paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }).catch(function (err) {
    bio.innerHTML = '<p>Could not load the bio (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file. See README.md.</p>';
  });

  /* ---------- floating publications ---------- */
  var ticker = document.getElementById('ticker');
  var entries = [];

  function cssNumber(el, prop, fallback) {
    var v = parseFloat(getComputedStyle(el).getPropertyValue(prop));
    return isNaN(v) ? fallback : v;
  }

  function build() {
    if (!entries.length) { ticker.innerHTML = ''; return; }

    var laneH = cssNumber(ticker, '--lane', 32);
    var fs = parseFloat(getComputedStyle(ticker).fontSize) || 23;
    var rows = Math.ceil(ticker.clientHeight / laneH) + 1;
    var vw = ticker.clientWidth || window.innerWidth;

    // Rough width of an entry, so rows can be balanced. Chinese characters are wider.
    var latin = fs * 0.44, cjk = fs * 0.98, gap = fs * 2.4;
    function width(e) {
      var w = gap;
      for (var i = 0; i < e.text.length; i++) w += e.text.charCodeAt(i) > 0x2e80 ? cjk : latin;
      return w;
    }

    var total = entries.reduce(function (a, e) { return a + width(e); }, 0);
    // Every row must be wider than the screen so the loop never shows a gap.
    // With lots of entries each appears once; with few, they repeat to fill the rows.
    var target = Math.max(vw * 1.25, total / rows);

    var idx = 0;
    var html = '';
    for (var r = 0; r < rows; r++) {
      var items = [];
      var w = 0;
      while (w < target && items.length < 400) {
        var e = entries[idx % entries.length];
        items.push('<span class="item">' + e.html + '</span>');
        w += width(e);
        idx++;
      }
      var half = items.join('');
      var dup = half.replace(/<a /g, '<a tabindex="-1" ');
      var speed = (24 + ((r * 7) % 20)) * (fs / 23);          // pixels per second
      var dur = Math.max(20, Math.round(w / speed));
      var delay = -((r * 41) % dur);
      html += '<div class="lane"><span class="dm" style="animation-duration:' + dur + 's;animation-delay:' + delay + 's">' +
        '<span class="half">' + half + '</span>' +
        '<span class="half" aria-hidden="true">' + dup + '</span></span></div>';
    }
    ticker.innerHTML = html;
  }

  Work.load(root).then(function (categories) {
    entries = categories.reduce(function (all, c) { return all.concat(c.entries); }, []);
    build();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
  }).catch(function (err) {
    ticker.innerHTML = '<p class="err">Could not load the publications (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file. See README.md.</p>';
  });
})();
