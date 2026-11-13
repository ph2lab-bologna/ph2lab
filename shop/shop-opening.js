(() => {
  const intro = document.querySelector('.shop-opening');
  if (!intro || typeof intro.showModal !== 'function' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      new URLSearchParams(location.search).get('skipintro') === '1' ||
      location.hash) return;

  const logos = [...intro.querySelectorAll('img')];
  const skip = intro.querySelector('button');
  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  let fallback;

  function finish() {
    if (!intro.open) return;
    clearTimeout(fallback);
    intro.close();
    root.style.overflow = previousOverflow;
    intro.remove();
  }

  skip.addEventListener('click', finish);
  intro.addEventListener('cancel', event => {
    event.preventDefault();
    finish();
  });
  window.addEventListener('pagehide', finish, { once: true });

  intro.showModal();
  root.style.overflow = 'hidden';
  fallback = setTimeout(finish, 5000);
  Promise.all(logos.map(logo => {
    logo.src = logo.dataset.src;
    return logo.decode();
  })).then(() => {
    if (!intro.open) return;
    logos.at(-1).addEventListener('animationend', () => {
      intro.classList.add('is-finishing');
    }, { once: true });
    intro.addEventListener('animationend', event => {
      if (event.target === intro && event.animationName === 'shop-opening-reveal') finish();
    });
    intro.classList.add('is-playing');
  }).catch(finish);
})();
