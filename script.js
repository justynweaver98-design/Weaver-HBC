const menu = document.querySelector('.menu');
const links = document.querySelector('.navlinks');

function setMenu(open) {
  if (!menu || !links) return;
  links.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
links?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!event.target.closest('header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});
window.matchMedia('(min-width: 1121px)').addEventListener('change', () => setMenu(false));

const viewer = document.querySelector('.modal');
if (viewer) {
  let photos = [];
  let current = 0;
  let previousFocus;
  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('[data-photo-caption]');
  const counter = viewer.querySelector('[data-photo-count]');

  function showPhoto(index) {
    current = (index + photos.length) % photos.length;
    image.src = photos[current].src;
    image.alt = photos[current].alt;
    caption.textContent = photos[current].alt;
    counter.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;
  }

  document.querySelectorAll('.gallery').forEach(gallery => {
    const images = [...gallery.querySelectorAll('img')];
    images.forEach((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Enlarge ' + photo.alt);
      photo.replaceWith(button);
      button.append(photo);
      button.addEventListener('click', () => {
        previousFocus = button;
        photos = images;
        showPhoto(index);
        viewer.showModal();
        viewer.classList.add('open');
        document.body.style.overflow = 'hidden';
        viewer.querySelector('[data-photo-close]').focus();
      });
    });
  });

  viewer.querySelector('[data-photo-close]').addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-photo-prev]').addEventListener('click', () => showPhoto(current - 1));
  viewer.querySelector('[data-photo-next]').addEventListener('click', () => showPhoto(current + 1));
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); }
  });
  viewer.addEventListener('close', () => {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
    previousFocus?.focus();
  });
}
