const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

/* ---------- Theme ---------- */
const themeBtn = $('#themeBtn');
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
const syncIcon = () => themeBtn.textContent = root.dataset.theme === 'dark' ? '☾' : '☀';
syncIcon();
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  syncIcon();
});

/* ---------- Mobile menu ---------- */
const navLinks = $('#navLinks');
$('#menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') navLinks.classList.remove('open'); });

/* ---------- Scroll spy ---------- */
const links = $$('.nav-links a');
const spy = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
links.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

/* ---------- Progress bar + nav shrink + back to top ---------- */
const bar = document.createElement('div');
bar.className = 'progress';
document.body.prepend(bar);
addEventListener('scroll', () => {
  const h = root.scrollHeight - innerHeight;
  bar.style.width = (scrollY / h * 100) + '%';
}, { passive: true });
$('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Starry sky + floating hearts ---------- */
const hero = $('.hero');
const sky = document.createElement('div');
sky.className = 'stars';
for (let i = 0; i < 70; i++) {
  const s = document.createElement('i');
  s.className = 'star';
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 65}%;--d:${2 + Math.random() * 4}s;--l:${Math.random() * 4}s;` +
    `width:${Math.random() > .85 ? 4 : 2}px;height:${Math.random() > .85 ? 4 : 2}px`;
  sky.appendChild(s);
}
for (let i = 0; i < 7; i++) {
  const h = document.createElement('span');
  h.className = 'float-heart';
  h.textContent = '♡';
  h.style.cssText = `left:${8 + Math.random() * 84}%;--d:${10 + Math.random() * 8}s;animation-delay:${Math.random() * 10}s;font-size:${12 + Math.random() * 14}px`;
  sky.appendChild(h);
}
hero.prepend(sky);

/* ---------- Typewriter role ---------- */
const role = $('.role');
const full = role.textContent.replace(/\s+/g, ' ').trim();
if (!reduce) {
  role.textContent = '';
  let i = 0;
  setTimeout(function type() {
    role.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(type, 45);
    else setTimeout(() => role.classList.add('done'), 1200);
  }, 900);
}

/* ---------- Mouse parallax on hero photo ---------- */
const frame = $('.frame'), quote = $('.script-quote');
if (!reduce) hero.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
  frame.style.transform = `rotate(3deg) translate(${x * 18}px,${y * 14}px)`;
  quote.style.translate = `${x * 30}px ${y * 20}px`;
});

/* ---------- Scroll reveal (staggered) ---------- */
const groups = [
  ['h2, .triple h3', ''], ['.about p', 'left'], ['.facts > div', ''], ['.into', 'right'],
  ['.into li', ''], ['.chips span', 'pop'], ['.script-note', ''], ['.link', ''],
  ['.card', ''], ['.exp-card, .hl, .contact-block > *', ''], ['.ach li', ''], ['.contact li', '']
];
groups.forEach(([sel, extra]) => $$(sel).forEach((el, i) => {
  el.classList.add('reveal');
  if (extra) el.classList.add(extra);
  el.style.setProperty('--i', (i % 8) * 0.08 + 's');
}));
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* ---------- 3D tilt on project cards ---------- */
if (!reduce) $$('.card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* ---------- Footer year, show-more, copy email ---------- */
$('#year').textContent = new Date().getFullYear();

const moreBtn = $('#moreBtn'), moreList = $('#moreList');
moreBtn.addEventListener('click', () => {
  const open = moreList.hidden;
  moreList.hidden = !open;
  moreBtn.setAttribute('aria-expanded', open);
  moreBtn.textContent = open ? 'Show less −' : 'Show 6 more +';
});

const copyBtn = $('#copyBtn');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('anuradhaawasthi27@gmail.com');
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => copyBtn.textContent = 'Copy email', 1800);
  } catch (e) {}
});