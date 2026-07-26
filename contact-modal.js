(() => {
  const panel = document.getElementById('contactPanel');
  if (!panel) return;
  const openers = document.querySelectorAll('[data-contact-open]');
  const closeButton = panel.querySelector('.contact-panel-close');

  const openPanel = (event) => {
    if (event) event.preventDefault();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('contact-panel-active');
    setTimeout(() => closeButton && closeButton.focus(), 50);
  };
  const closePanel = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('contact-panel-active');
  };

  openers.forEach(el => el.addEventListener('click', openPanel));
  if (closeButton) closeButton.addEventListener('click', closePanel);
  panel.addEventListener('click', event => { if (event.target === panel) closePanel(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanel(); });
})();
