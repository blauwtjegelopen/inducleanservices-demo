const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 12);
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Menu openen');
  document.body.classList.remove('menu-open');
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

year.textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const subject = `Websiteaanvraag: ${data.get('dienst')}`;
  const body = [
    `Naam: ${data.get('naam')}`,
    `Organisatie: ${data.get('organisatie') || '-'}`,
    `E-mail: ${data.get('email')}`,
    `Telefoon: ${data.get('telefoon') || '-'}`,
    `Dienst: ${data.get('dienst')}`,
    '',
    'Toelichting:',
    data.get('bericht')
  ].join('\n');

  window.location.href = `mailto:info@inducleanservices.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
