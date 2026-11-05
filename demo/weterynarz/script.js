(function(){
  var btn=document.querySelector('.nav-toggle');
  var nav=document.getElementById('menu');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.querySelector('span').textContent=open?'Zamknij':'Menu';
    });
  }
  var today=document.getElementById('today-hours');
  if(today){
    var d=new Date().getDay();
    var txt,closed=false;
    if(d>=1&&d<=5){txt='Dziś otwarte 8:00 do 20:00';}
    else if(d===6){txt='Dziś otwarte 9:00 do 14:00';}
    else{txt='Dziś zamknięte, dyżur telefoniczny do 22:00';closed=true;}
    today.querySelector('.txt').textContent=txt;
    if(closed){today.querySelector('.dot').classList.add('closed');}
  }
})();
