(function(){
  var root=document.documentElement, btn=document.getElementById('theme');
  try{var t=localStorage.getItem('theme'); if(t) root.setAttribute('data-theme',t);}catch(e){}
  btn.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });
  document.getElementById('yr').textContent=new Date().getFullYear();

  var motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motion) root.classList.add('motion');

  /* ---- hero entrance ---- */
  var hero=document.querySelector('.hero');
  var hItems=hero.querySelectorAll('.h-rv');
  hero.querySelectorAll('h1 .ln').forEach(function(el,i){el.style.setProperty('--d',(150+i*140)+'ms')});
  hItems.forEach(function(el){el.classList.add('rv');el.style.setProperty('--d',(el.dataset.d||0)+'ms')});
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    hero.classList.add('in'); hItems.forEach(function(el){el.classList.add('in')});
    setTimeout(function(){hItems.forEach(function(el){el.style.setProperty('--d','0ms')})},1800);
  })});

  /* ---- counting numbers ---- */
  function fmt(el,v){return (el.dataset.pre||'')+v.toFixed(+(el.dataset.dec||0))+(el.dataset.suf||'')}
  document.querySelectorAll('[data-to]').forEach(function(el){ if(motion) el.textContent=fmt(el,+(el.dataset.from||0)); });
  function count(el){
    if(!motion) return;
    var to=parseFloat(el.dataset.to), from=parseFloat(el.dataset.from||0), t0=null, dur=1700;
    function step(t){ if(!t0) t0=t; var p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=fmt(el,from+(to-from)*e); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  /* ---- scroll reveals ---- */
  var sel='.block-head,.row,.rcard,.card,dl.skills,.two,.themes,.contact .label,.contact h2,.contact .meta,.band';
  var els=[].slice.call(document.querySelectorAll(sel));
  els.forEach(function(el){
    el.classList.add('rv');
    if(el.matches('.rcard,.card')){
      var sib=[].slice.call(el.parentNode.children).filter(function(c){return c.matches(sel)});
      el.style.setProperty('--d',Math.min(sib.indexOf(el),4)*100+'ms');
    }
  });
  function reveal(el){
    el.classList.add('in');
    setTimeout(function(){el.style.setProperty('--d','0ms')},1400);
    el.querySelectorAll('[data-to]').forEach(count);
  }
  if('IntersectionObserver' in window && motion){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el){io.observe(el)});
  } else els.forEach(function(el){el.classList.add('in')});

  /* ---- active nav link ---- */
  var links={}; document.querySelectorAll('.nav nav a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var nio=new IntersectionObserver(function(es){es.forEach(function(e){
      var a=links[e.target.id]; if(!a) return;
      if(e.isIntersecting){for(var k in links) links[k].classList.remove('on'); a.classList.add('on');}
    })},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(id){var s=document.getElementById(id); if(s) nio.observe(s)});
  }

  /* ---- blocks graphic: a random gray tile lights up now and then ---- */
  if(motion){
    var gt=[].slice.call(document.querySelectorAll('.tile.g'));
    setInterval(function(){
      if(document.hidden||!gt.length) return;
      var t=gt[Math.floor(Math.random()*gt.length)];
      t.classList.add('flash'); setTimeout(function(){t.classList.remove('flash')},1000);
    },1200);
  }
})();

(function(){
  var v=document.querySelector('.robot-vid');
  if(v && matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();}
})();

(function(){
  var bands=[].slice.call(document.querySelectorAll('.band'));
  if(!bands.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var mq=matchMedia('(max-width:700px)'), tick=false;
  function update(){
    tick=false;
    if(mq.matches) return;
    var vh=innerHeight;
    bands.forEach(function(b){
      var r=b.getBoundingClientRect();
      if(r.bottom<0||r.top>vh) return;
      var p=((r.top+r.height/2)-vh/2)/(vh/2+r.height/2);
      b.style.setProperty('--p',Math.max(-1,Math.min(1,p)).toFixed(3));
    });
  }
  function req(){ if(!tick){tick=true;requestAnimationFrame(update)} }
  addEventListener('scroll',req,{passive:true});
  addEventListener('resize',req);
  update();
})();
