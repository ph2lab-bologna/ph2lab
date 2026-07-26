const intro = document.getElementById('intro');
const page = document.getElementById('page');
const skip = document.getElementById('skipIntro');
const menuButton = document.getElementById('menuButton');
const menuOverlay = document.getElementById('menuOverlay');

function finishIntro(){
  if (!intro || !page) return;
  page.classList.add('visible');
  intro.classList.add('exit');
  document.body.style.overflow = 'auto';
}

function scrollToBottom(){
  window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'auto'});
}

function scrollToContactStable(){
  const contact = document.getElementById('contact');
  if (!contact) return;

  // The page contains many lazy-loaded images. Their heights can change after
  // the first jump, so keep the footer pinned to the viewport while they load.
  const pin = () => scrollToBottom();
  pin();
  [60, 180, 450, 900, 1600, 2600].forEach(ms => setTimeout(pin, ms));
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', pin, {once:true});
  });
}

function scrollToCurrentHash(behavior = 'auto'){
  const hash = window.location.hash;
  if (!hash) return;
  if (hash === '#contact') {
    scrollToContactStable();
    return;
  }
  const target = document.querySelector(hash);
  if (!target) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => target.scrollIntoView({behavior, block:'start'}));
  });
}

const params = new URLSearchParams(window.location.search);
const goto = params.get('goto');
const bypassIntro = params.get('skipintro') === '1' || Boolean(window.location.hash) || goto === 'contact';

if (skip) skip.addEventListener('click', () => {
  finishIntro();
  if (goto === 'contact') scrollToContactStable();
  else setTimeout(() => scrollToCurrentHash('smooth'), 50);
});

window.addEventListener('load', () => {
  if (bypassIntro) {
    finishIntro();
    if (goto === 'contact') {
      scrollToContactStable();
    } else {
      setTimeout(() => scrollToCurrentHash('auto'), 120);
      setTimeout(() => scrollToCurrentHash('auto'), 700);
    }
  } else {
    setTimeout(finishIntro, 4700);
  }
});

function toggleMenu(force){
  if (!menuOverlay || !menuButton) return;
  const shouldOpen = typeof force === 'boolean' ? force : !menuOverlay.classList.contains('open');
  menuOverlay.classList.toggle('open', shouldOpen);
  menuButton.classList.toggle('open', shouldOpen);
  menuButton.setAttribute('aria-expanded', shouldOpen);
  menuOverlay.setAttribute('aria-hidden', String(!shouldOpen));
  document.body.style.overflow = shouldOpen ? 'hidden' : 'auto';
}

if (menuButton) menuButton.addEventListener('click', () => toggleMenu());
if (menuOverlay) {
  menuOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', event => {
    const href = a.getAttribute('href') || '';
    toggleMenu(false);
    if (href.startsWith('#')) {
      event.preventDefault();
      history.replaceState(null, '', href);
      if (href === '#contact') {
        scrollToContactStable();
      } else {
        const target = document.querySelector(href);
        if (target) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 30);
      }
    }
  }));
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (menuOverlay && menuOverlay.contains(a)) return;
  a.addEventListener('click', event => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, '', href);
    if (href === '#contact') scrollToContactStable();
    else target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

document.addEventListener('keydown', e => { if(e.key === 'Escape') toggleMenu(false); });
