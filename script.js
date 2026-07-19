// ---------- boot loader ----------
  setTimeout(() => {
    document.getElementById('boot').classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 1800);

  // ---------- starfield ----------
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  function initStars(){
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.3 + 0.2,
        s: Math.random()*0.5 + 0.1,
        tw: Math.random()*Math.PI*2
      });
    }
  }
  let shootingStars = [];
  function spawnShootingStar(){
    const startX = Math.random() * canvas.width * 0.6;
    const startY = Math.random() * (window.innerHeight * 0.5);
    shootingStars.push({
      x:startX, y:startY,
      vx: 6 + Math.random()*4, vy: 3 + Math.random()*2,
      life: 1
    });
  }
  setInterval(() => { if(Math.random() < 0.7) spawnShootingStar(); }, 3500);

  function drawStars(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const st of stars){
      st.tw += 0.02;
      const alpha = 0.4 + Math.sin(st.tw)*0.4;
      ctx.beginPath();
      ctx.fillStyle = `rgba(200,190,255,${Math.max(0,alpha)})`;
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
    }
    shootingStars.forEach(s => {
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*8, s.y - s.vy*8);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(1, 'rgba(157,92,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx*8, s.y - s.vy*8);
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.02;
    });
    shootingStars = shootingStars.filter(s => s.life > 0 && s.y < window.innerHeight + 40);
    requestAnimationFrame(drawStars);
  }
  resize(); initStars(); drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });

  // ---------- floating code-symbol particles ----------
  const pcanvas = document.getElementById('particles');
  const pctx = pcanvas.getContext('2d');
  let pw, ph;
  function presize(){ pw = pcanvas.width = window.innerWidth; ph = pcanvas.height = window.innerHeight; }
  presize();
  window.addEventListener('resize', presize);

  const SYMS = ['{','}','<','>','/','(',')',';','=>','#'];
  const PCOLORS = ['#9d5cff','#4fd1ff','#ff5ca8'];
  const PN = window.innerWidth < 700 ? 40 : 75;
  let pparticles = [];
  function makeParticles(){
    pparticles = [];
    for(let i=0;i<PN;i++){
      pparticles.push({
        x: Math.random()*pw, y: Math.random()*ph,
        vx: (Math.random()-0.5)*0.22, vy: (Math.random()-0.5)*0.22,
        s: 12 + Math.random()*14,
        sym: SYMS[Math.floor(Math.random()*SYMS.length)],
        color: PCOLORS[Math.floor(Math.random()*PCOLORS.length)],
        alpha: 0.28 + Math.random()*0.45
      });
    }
  }
  makeParticles();
  window.addEventListener('resize', makeParticles);

  let pmx = -9999, pmy = -9999;
  window.addEventListener('mousemove', (e) => { pmx = e.clientX; pmy = e.clientY; });

  function ptick(){
    pctx.clearRect(0,0,pw,ph);
    pparticles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = pw + 20;
      if(p.x > pw + 20) p.x = -20;
      if(p.y < -20) p.y = ph + 20;
      if(p.y > ph + 20) p.y = -20;

      const dx = p.x - pmx, dy = p.y - pmy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let scale = 1;
      if(dist < 140){ scale = 1 + (140 - dist) / 140 * 0.8; }

      pctx.save();
      pctx.globalAlpha = p.alpha;
      pctx.fillStyle = p.color;
      pctx.shadowColor = p.color;
      pctx.shadowBlur = 10;
      pctx.font = `${p.s * scale}px 'JetBrains Mono', monospace`;
      pctx.fillText(p.sym, p.x, p.y);
      pctx.restore();
    });
    requestAnimationFrame(ptick);
  }
  ptick();

  // ---------- mouse parallax on sky (stars + clouds) ----------
  const cloudsLayer = document.querySelector('.clouds');
  window.addEventListener('mousemove', (e) => {
    const relX = (e.clientX / window.innerWidth) - 0.5;
    const relY = (e.clientY / window.innerHeight) - 0.5;
    canvas.style.transform = `translate(${relX * -16}px, ${relY * -12}px)`;
    cloudsLayer.style.transform = `translate(${relX * -28}px, ${relY * -18}px)`;
  });

  // ---------- custom cursor ----------
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    const cDot = document.createElement('div'); cDot.className = 'cursor-dot';
    document.body.appendChild(cDot);

    window.addEventListener('mousemove', (e) => {
      cDot.style.left = e.clientX + 'px';
      cDot.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => cDot.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => cDot.classList.remove('cursor-hidden'));
  }

  // ---------- mobile nav toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // ---------- interactive coffee cup ----------
  const heroCoffee = document.getElementById('heroCoffee');
  heroCoffee.addEventListener('click', () => {
    heroCoffee.classList.add('blown');
    setTimeout(() => heroCoffee.classList.remove('blown'), 900);
  });

  // ---------- scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ---------- project card glow follow ----------
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // ---------- now playing widget ----------
  const barsWrap = document.getElementById('bars');
  const BAR_COUNT = 28;
  for(let i=0;i<BAR_COUNT;i++){
    const b = document.createElement('div');
    b.className = 'bar';
    barsWrap.appendChild(b);
  }
  const barEls = barsWrap.querySelectorAll('.bar');

  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const albumArt = document.getElementById('albumArt');
  const nowLabel = document.getElementById('nowLabel');
  const pulseDot = document.getElementById('pulseDot');

  let isPlaying = false;

  function randomizeBars(){
    barEls.forEach(b => {
      const h = isPlaying ? (15 + Math.random()*85) : 12;
      b.style.height = h + '%';
    });
    setTimeout(randomizeBars, isPlaying ? 90 : 400);
  }
  randomizeBars();

  function setPausedUI(label){
    isPlaying = false;
    albumArt.classList.remove('playing');
    nowLabel.textContent = label;
    pulseDot.classList.remove('live');
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if(isPlaying){
      if(audio.getAttribute('src')){
        audio.play().catch(()=>{ /* no file wired up yet, animation still runs */ });
      }
      albumArt.classList.add('playing');
      nowLabel.textContent = 'Now Playing';
      pulseDot.classList.add('live');
      playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
    } else {
      audio.pause();
      setPausedUI('Paused');
    }
  });

  audio.addEventListener('ended', () => {
    setPausedUI('Finished');
    audio.currentTime = 0; // rewind so pressing play again starts from the beginning
  });
