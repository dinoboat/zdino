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
      'This page must be opened through a web server, not by double-clicking the file.</p>';
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

    // Use the text size set in the stylesheet (it is smaller on phones)
    var fs = parseFloat(getComputedStyle(ticker).fontSize) || 23;
    var laneH = cssNumber(ticker, '--lane', 32);
    var vw = ticker.clientWidth || window.innerWidth;
    var vh = ticker.clientHeight || window.innerHeight;

    // Measure how wide each entry really is, in "em", by laying them out invisibly at a known size.
    // (Measuring beats guessing: it is exact for whatever font the visitor's browser ends up using.)
    var GAP = 2.4;   // space after each entry, in em (matches .item padding in the stylesheet)
    var probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;white-space:nowrap;' +
      'font-family:var(--font);font-weight:500;font-size:100px;';
    probe.innerHTML = entries.map(function (e) { return '<span>' + e.html + '</span>'; }).join('<br>');
    document.body.appendChild(probe);
    var spans = probe.querySelectorAll('span');
    var totalUnits = 0;
    entries.forEach(function (e, i) {
      e.units = spans[i].getBoundingClientRect().width / 100 + GAP;
      totalUnits += e.units;
    });
    document.body.removeChild(probe);
    function width(e) { return e.units * fs; }
    var total = totalUnits * fs;

    // Every publication appears once. Use only as many rows as they need (about one screen-width of
    // text per row) and leave the rest of the screen empty. Nothing is repeated to fill it.
    var maxRows = Math.ceil(vh / laneH) + 1;
    var rows = Math.min(maxRows, Math.max(1, Math.round(total / vw)));
    ticker.style.setProperty('--lw', vw + 'px');

    var idx = 0, consumed = 0, html = '';
    for (var r = 0; r < rows && idx < entries.length; r++) {
      var last = (r === rows - 1);
      var target = (total - consumed) / (rows - r);   // share what is left evenly over the rows left
      var items = [], w = 0;
      while (idx < entries.length) {
        var e = entries[idx], ew = width(e);
        // stop early if adding this entry would overshoot by more than stopping undershoots
        if (!last && items.length && w + ew > target && (w + ew - target) > (target - w)) break;
        items.push('<span class="item">' + e.html + '</span>');
        w += ew;
        idx++;
        if (!last && w >= target) break;
      }
      consumed += w;
      var speed = (24 + ((r * 7) % 20)) * (fs / 23);             // pixels per second
      var dur = Math.max(20, Math.round((vw + w) / speed));       // one pass: in from the right, out to the left
      var delay = -Math.round(dur * ((r * 0.6180339887) % 1));    // start each row at a different point
      html += '<div class="lane"><span class="dm" style="animation-duration:' + dur + 's;animation-delay:' + delay + 's">' +
        items.join('') + '</span></div>';
    }
    ticker.innerHTML = html;
  }

  Work.load(root).then(function (categories) {
    entries = categories.reduce(function (all, c) { return all.concat(c.entries); }, []);
    build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
  }).catch(function (err) {
    ticker.innerHTML = '<p class="err">Could not load the publications (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file.</p>';
  });
})();
