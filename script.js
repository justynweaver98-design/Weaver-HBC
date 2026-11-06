const menu = document.querySelector('.menu');
const links = document.querySelector('.navlinks');
function setMenu(open) {
  if (!menu || !links) return;
  links.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.navlinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (!e.target.closest('header')) setMenu(false); });
const modal = document.querySelector('.modal');
let previousFocus;
function closePhoto() {
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  previousFocus?.focus();
}
if (modal) {
  document.querySelectorAll('.gallery img').forEach(img => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Enlarge ${img.alt}`);
    img.replaceWith(button); button.append(img);
    button.addEventListener('click', () => {
      previousFocus = button;
      const expanded = modal.querySelector('img');
      expanded.src = img.src; expanded.alt = img.alt;
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      modal.querySelector('button').focus();
    });
  });
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('button')) closePhoto(); });
  modal.addEventListener('keydown', e => { if(e.key === 'Tab') { e.preventDefault(); modal.querySelector('button').focus(); } });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePhoto(); setMenu(false); } });
window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
