(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Otwórz menu');
    }
  });
})();
