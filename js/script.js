// terminal typing
const lines = [
  ['<span class="p">$</span> whoami', 400],
  ['<span class="c">vandana venu</span> <span class="m">// support engineer → cloud</span>', 250],
  ['<span class="p">$</span> cat skills.txt', 400],
  ['<span class="y">lti</span>  <span class="y">apis</span>  <span class="y">sso</span>  <span class="y">sql</span>  <span class="y">dns</span>  <span class="y">c#</span>', 250],
  ['<span class="p">$</span> ./debug --issue "login failed"', 400],
  ['<span class="m">[1/3]</span> reproducing issue ........ <span class="p">ok</span>', 300],
  ['<span class="m">[2/3]</span> tracing saml response .... <span class="p">ok</span>', 300],
  ['<span class="m">[3/3]</span> root cause found ......... <span class="k">fixed ✓</span>', 300],
  ['<span class="p">$</span> echo $NEXT', 400],
  ['<span class="c">cloud support engineer</span> ☁', 200]
];
const term = document.getElementById('term');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  term.innerHTML = lines.map(l => l[0]).join('\n') + '\n<span class="p">$</span> <span class="cursor"></span>';
} else {
  let i = 0;
  const next = () => {
    if (i >= lines.length) { term.innerHTML += '<span class="p">$</span> <span class="cursor"></span>'; return; }
    term.innerHTML += lines[i][0] + '\n';
    setTimeout(next, lines[i][1] + 250);
    i++;
  };
  setTimeout(next, 500);
}

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// role rotator
const roles = ['fixing LTI integrations', 'checking SPF, DKIM & DMARC', 'zero SLA breaches so far', 'tracing API requests', 'fixing email delivery', 'untangling automations', 'learning AWS, one service at a time'];
const rot = document.getElementById('rot');
if (reduce) { rot.textContent = roles[0]; } else {
  let r = 0, ch = 0, del = false;
  const tick = () => {
    const w = roles[r];
    rot.textContent = w.slice(0, ch);
    if (!del && ch < w.length) { ch++; setTimeout(tick, 55); }
    else if (!del) { del = true; setTimeout(tick, 1600); }
    else if (ch > 0) { ch--; setTimeout(tick, 25); }
    else { del = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
  };
  tick();
}

// animated counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1400;
  const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); };
  reduce ? el.textContent = end + suf : requestAnimationFrame(step);
  cio.unobserve(el);
}), {threshold:.5});
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// sketch draws itself when visible
const sk = document.getElementById('sketch');
sk.querySelectorAll('path,circle,rect,line').forEach((p, i) => {
  try { if (!p.getAttribute('style')) { const L = Math.ceil(p.getTotalLength()); p.style.setProperty('--len', L); } p.style.animationDelay = (i * 0.18) + 's'; } catch (e) {}
});
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { sk.classList.add('draw'); o.disconnect(); } }), {threshold:.4}).observe(sk);

// cursor glow + card tilt (desktop only)
const glow = document.getElementById('glow');
if (!reduce && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
  document.querySelectorAll('.tilt, .skill-card, .proj').forEach(c => {
    c.addEventListener('pointermove', e => {
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      c.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });
    c.addEventListener('pointerleave', () => c.style.transform = '');
  });
} else { glow.style.display = 'none'; }

// copy buttons
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'copied ✓'; }
  catch (e) { b.textContent = 'select & copy'; }
  setTimeout(() => b.textContent = 'copy', 1800);
}));
