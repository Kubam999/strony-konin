(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('menu-glowne');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  var godziny = { 0: ['10:00', '18:00'], 1: ['7:30', '19:00'], 2: ['7:30', '19:00'], 3: ['7:30', '19:00'], 4: ['7:30', '19:00'], 5: ['7:30', '19:00'], 6: ['9:00', '20:00'] };
  var dzis = new Date();
  var h = godziny[dzis.getDay()];
  var status = document.getElementById('dzis-status');
  var zakres = document.getElementById('dzis-godziny');
  if (h && status && zakres) {
    var toMin = function (s) { var p = s.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); };
    var teraz = dzis.getHours() * 60 + dzis.getMinutes();
    var otwarte = teraz >= toMin(h[0]) && teraz < toMin(h[1]);
    status.textContent = otwarte ? 'Dziś otwarte' : 'Dziś czynne';
    zakres.textContent = h[0] + ' do ' + h[1];
  }
})();
