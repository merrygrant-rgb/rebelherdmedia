/* Rebel Herd Media — site behaviour (no dependencies) */
(function () {
  'use strict';
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;
  var head = btn.closest('.site-head') || document.body;

  function isOpen() { return menu.classList.contains('open'); }
  function setOpen(open, focusTarget) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open && focusTarget === 'first') {
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
    if (!open && focusTarget === 'button') btn.focus();
  }

  btn.setAttribute('aria-label', 'Open menu');
  btn.addEventListener('click', function () { setOpen(!isOpen()); });

  /* Enter/Space already activate the button; Arrow Down opens and moves into the menu */
  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true, 'first'); }
  });

  /* Escape closes from anywhere in the header and returns focus to the button */
  head.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { e.preventDefault(); setOpen(false, 'button'); }
  });

  /* Arrow keys move between items while the menu is open */
  menu.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    var items = [].slice.call(menu.querySelectorAll('a'));
    var i = items.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
  });

  /* Close when focus or a click leaves the header */
  document.addEventListener('focusin', function (e) {
    if (isOpen() && !head.contains(e.target)) setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (isOpen() && !head.contains(e.target)) setOpen(false);
  });

  /* If the viewport grows past the hamburger breakpoint, reset state */
  var mq = window.matchMedia('(min-width:961px)');
  function onChange() { if (mq.matches && isOpen()) setOpen(false); }
  if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
})();
