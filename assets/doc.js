/*
  Text pages (such as /cfa/): fills the page from a text file in the content folder.

  One language:   <main id="doc" data-content="content/page.md">
  Two languages:  <main id="doc" data-default-lang="zh"
                        data-content-zh="content/page-zh.md" data-content-en="content/page-en.md">
                  plus buttons  <button data-lang="zh">  /  <button data-lang="en">  to switch.
                  The address  .../#en  opens the English version directly.

  You should not need to edit this file. Edit the text files instead.
*/
(function () {
  'use strict';

  var root = document.body.getAttribute('data-root') || './';
  var main = document.getElementById('doc');
  var buttons = [].slice.call(document.querySelectorAll('[data-lang]')).filter(function (b) { return b.tagName === 'BUTTON'; });
  var LANG_TAG = { zh: 'zh-Hans', en: 'en' };

  // which languages this page has, e.g. { zh: 'content/cfa-zh.md', en: 'content/cfa-en.md' }
  var files = {};
  [].slice.call(main.attributes).forEach(function (a) {
    var m = a.name.match(/^data-content-([a-z]+)$/);
    if (m) files[m[1]] = a.value;
  });
  var single = main.getAttribute('data-content');
  var defaultLang = main.getAttribute('data-default-lang') || Object.keys(files)[0];
  var cache = {};

  function fail(err) {
    main.innerHTML = '<p>Could not load this page (' + err.message + '). ' +
      'This page must be opened through a web server, not by double-clicking the file.</p>';
  }

  function show(doc, file) {
    main.innerHTML = doc.html || '<p>Nothing here yet. Add text to ' + file + '.</p>';
    if (doc.title) document.title = doc.title + ' | Dino Ge Zhang';
  }

  function setLang(lang, updateAddress) {
    if (!files[lang]) lang = defaultLang;
    var file = files[lang];
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    main.setAttribute('lang', LANG_TAG[lang] || lang);
    document.documentElement.setAttribute('lang', LANG_TAG[lang] || lang);
    if (updateAddress && window.history && history.replaceState) {
      history.replaceState(null, '', lang === defaultLang ? location.pathname + location.search : '#' + lang);
    }
    var p = cache[lang] || (cache[lang] = Work.loadDoc(root, file));
    p.then(function (doc) { show(doc, file); }).catch(function (err) { delete cache[lang]; fail(err); });
  }

  if (single) {
    // one-language page
    Work.loadDoc(root, single).then(function (doc) { show(doc, single); }).catch(fail);
    return;
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  window.addEventListener('hashchange', function () { setLang(location.hash.slice(1), false); });

  setLang(location.hash.slice(1) || defaultLang, false);
})();
