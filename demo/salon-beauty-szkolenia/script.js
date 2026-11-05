(function(){
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.getElementById('menu');
  if(!toggle||!nav)return;
  toggle.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',open?'true':'false');
    toggle.lastChild.textContent=open?'Zamknij':'Menu';
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&nav.classList.contains('open')){
      nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.lastChild.textContent='Menu';toggle.focus();
    }
  });
})();
