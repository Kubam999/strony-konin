(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var input = document.getElementById('zuzycie');
  var box = document.getElementById('estymata');
  var out = document.getElementById('estymata-moc');
  if (input && box && out) {
    var update = function () {
      var kwh = parseFloat(input.value);
      if (!kwh || kwh < 500) { box.hidden = true; return; }
      var kwp = Math.round((kwh / 1000) * 1.2 * 2) / 2;
      out.textContent = 'ok. ' + kwp.toFixed(1).replace('.', ',') + ' kWp';
      box.hidden = false;
    };
    input.addEventListener('input', update);
    update();
  }
})();
