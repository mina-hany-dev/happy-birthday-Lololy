(() => {
'use strict';
const $ = s => document.querySelector(s);
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Intro
const intro = $('#intro');
function enter(){ intro.classList.add('gone'); document.body.classList.remove('locked'); setTimeout(()=>intro.remove(),1100); }
$('#open').onclick = () => {
  intro.classList.add('opened');
  const b = document.createElement('button');
  b.className = 'btn'; b.textContent = 'Enter the Magic';
  b.onclick = enter; intro.appendChild(b); b.focus();
};
$('#skip').onclick = enter;

// Video reveal (edit assets/lololy-birthday.mp4 — see index.html)
const vid = $('#vid'), miss = $('#vid-missing');
vid.addEventListener('error', () => { vid.hidden = true; miss.hidden = false; });
function reveal(){
  $('#reveal').classList.add('open'); $('#reveal2').hidden = true;
  setTimeout(() => { $('#book-wrap').hidden = true; $('#player').hidden = false;
    $('#player').scrollIntoView({behavior: still ? 'auto' : 'smooth', block:'center'}); burst(innerWidth/2, innerHeight/2, 60); }, still ? 0 : 900);
}
$('#reveal').onclick = $('#reveal2').onclick = reveal;

// 21 wishes
const wishes = ["May your dreams always feel within reach.","May your laughter fill every room you enter.","May you find magic in the smallest moments.","May your friendships grow stronger with time.","May courage always accompany your adventures.","May every ending lead to a beautiful beginning.","May you never stop discovering who you are.","May life surprise you in the loveliest ways.","May happiness find you even on ordinary days.","May your heart always know where it belongs.","May your future be brighter than the stars.","May you always have reasons to smile.","May your kindness return to you tenfold.","May you be brave enough to chase your dreams.","May you collect memories, not just moments.","May every challenge reveal your strength.","May your story be wonderfully your own.","May you always feel loved and appreciated.","May adventure find its way to your doorstep.","May your next chapter exceed your wildest dreams.","And may your twenty-first year be your most magical one yet."];
const grid = $('#grid');
wishes.forEach((w,i) => {
  const c = document.createElement('button'); c.className = 'card';
  c.setAttribute('aria-label', 'Wish ' + (i+1) + ', tap to reveal');
  c.innerHTML = '<span class="f">' + (i+1) + '</span><span class="b"></span>';
  c.lastChild.textContent = w;
  c.onclick = () => c.classList.toggle('flip');
  grid.appendChild(c);
});

// Particles + bursts
const cv = $('#sparks'), g = cv.getContext('2d'); let P = [], B = [];
function size(){ cv.width = innerWidth; cv.height = innerHeight; }
size(); addEventListener('resize', size);
const mk = () => ({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.8+.4,vy:-(Math.random()*.25+.05),vx:(Math.random()-.5)*.15,a:Math.random()});
for(let i=0;i<(innerWidth<700?45:90);i++) P.push(mk());
function burst(x,y,n){ if(still) return; for(let i=0;i<n;i++){const t=Math.random()*6.28,s=Math.random()*5+1;B.push({x,y,vx:Math.cos(t)*s,vy:Math.sin(t)*s,l:1});} }
(function tick(){
  g.clearRect(0,0,cv.width,cv.height);
  for(const p of P){ if(!still){p.x+=p.vx;p.y+=p.vy;p.a+=.02;} if(p.y<-5){p.y=cv.height+5;p.x=Math.random()*cv.width;}
    g.globalAlpha=.35+.35*Math.sin(p.a); g.fillStyle='#f0d28f'; g.beginPath(); g.arc(p.x,p.y,p.r,0,6.28); g.fill(); }
  for(const b of B){ b.x+=b.vx;b.y+=b.vy;b.vy+=.06;b.l-=.015; g.globalAlpha=Math.max(b.l,0); g.fillStyle='#ffd98a'; g.fillRect(b.x,b.y,3,3); }
  B = B.filter(b => b.l > 0);
  requestAnimationFrame(tick);
})();

// Birthday wish
$('#wish').onclick = e => {
  const r = e.target.getBoundingClientRect();
  [0,350,700].forEach(d => setTimeout(() => burst(r.left+r.width/2 + (Math.random()-.5)*300, r.top - 60*Math.random(), 70), d));
  $('#wish-msg').textContent = 'Close your eyes, make a wish, and let the magic begin.';
};

// Music (starts only on click; add assets/music.mp3)
const bgm = $('#bgm');
const mb = $('#music');

bgm.volume = 0.35;

// Try autoplay when the page loads
window.addEventListener('load', () => {
  bgm.play()
    .then(() => {
      mb.textContent = '♪ Music on';
      mb.setAttribute('aria-pressed', 'true');
    })
    .catch(() => {
      mb.textContent = '♪ Tap to play music';
      mb.setAttribute('aria-pressed', 'false');
    });
});

// Toggle music on/off
mb.onclick = () => {
  if (bgm.paused) {
    bgm.play()
      .then(() => {
        mb.textContent = '♪ Music on';
        mb.setAttribute('aria-pressed', 'true');
      })
      .catch(() => {
        mb.textContent = '♪ Unable to play music';
      });
  } else {
    bgm.pause();
    mb.textContent = '♪ Music off';
    mb.setAttribute('aria-pressed', 'false');
  }
};
})();
