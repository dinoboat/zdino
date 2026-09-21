/*
  Reads content/work.md and turns it into data both pages use.
  You should never need to edit this file. Edit content/work.md instead.
*/
(function () {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Where the site's top folder is, relative to the current page ('./' on Home, '../' on Work).
  var siteRoot = './';

  function safeUrl(u) {
    if (/^\s*(javascript|data|vbscript):/i.test(u)) return '#';
    // Links like  pdfs/paper.pdf  are written relative to the site's top folder,
    // so they work from every page. Full addresses (https://...), /absolute and #anchors are left alone.
    if (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(u)) return u;
    return siteRoot + u;
  }

  // [words](address) -> link, *words* -> italics. Everything else is plain text.
  function inline(md) {
    var s = esc(md);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
      return '<a href="' + safeUrl(url) + '">' + text + '</a>';
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return s;
  }

  // The same entry as plain text (used to size the floating rows).
  function plain(md) {
    return md.replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/\*+/g, '');
  }

  function parse(md) {
    md = md.replace(/<!--[\s\S]*?-->/g, '');
    var categories = [];
    var current = null;
    md.split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      var m;
      if ((m = line.match(/^##\s+(.*)$/))) {
        current = { title: m[1].trim(), entries: [] };
        categories.push(current);
      } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
        if (!current) {
          current = { title: '', entries: [] };
          categories.push(current);
        }
        var text = m[1].trim();
        current.entries.push({ md: text, html: inline(text), text: plain(text) });
      }
    });
    return categories;
  }

  function load(root) {
    siteRoot = root;
    return fetch(root + 'content/work.md', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load content/work.md (' + r.status + ')');
      return r.text();
    }).then(parse);
  }

  // The Home page bio box: paragraphs separated by blank lines, same [link](address) and *italics* symbols.
  function loadBio(root) {
    siteRoot = root;
    return fetch(root + 'content/bio.md', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load content/bio.md (' + r.status + ')');
      return r.text();
    }).then(function (md) {
      md = md.replace(/<!--[\s\S]*?-->/g, '');
      return md.split(/\r?\n[ \t]*\r?\n/)
        .map(function (p) { return p.replace(/[ \t]*\r?\n[ \t]*/g, ' ').trim(); })
        .filter(Boolean)
        .map(inline);
    });
  }

  window.Work = { load: load, loadBio: loadBio, parse: parse, inline: inline, plain: plain };
})();
