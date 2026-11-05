// Nazwa zespołu w jednym miejscu. Zmień tutaj (i w atrybucie data-brand w body), a podmieni się wszędzie.
const BRAND = document.body.dataset.brand || 'Studio Konin';
document.querySelectorAll('.brand').forEach(el => { el.textContent = BRAND; });
document.title = document.title.replace('Studio Konin', BRAND);

// Menu mobilne
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Zamknij' : 'Menu';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Menu';
  }));
}
