(() => {
  const panel = document.getElementById('contactPanel');
  if (!panel) return;
  const closeButton = panel.querySelector('.contact-panel-close');
  let returnFocus;

  document.querySelectorAll('[data-contact-open]').forEach(opener => {
    opener.addEventListener('click', event => {
      event.preventDefault();
      if (panel.open) return;
      returnFocus = opener.closest('#menuOverlay') ? document.getElementById('menuButton') : opener;
      panel.showModal();
      document.body.classList.add('contact-panel-active');
    });
  });

  closeButton.addEventListener('click', () => panel.close());
  panel.addEventListener('close', () => {
    document.body.classList.remove('contact-panel-active');
    returnFocus?.focus({ preventScroll: true });
  });
})();
