const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navDropdown = document.querySelector('.nav-dropdown');
const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');

function updateHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 12);
}

function closeDropdown() {
  if (!navDropdown || !navDropdownToggle) return;
  navDropdown.classList.remove('open');
  navDropdownToggle.setAttribute('aria-expanded', 'false');
}

function closeMenu() {
  if (navLinks && menuToggle) {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menu openen');
  }
  closeDropdown();
  document.body.classList.remove('menu-open');
}

if (header) {
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

if (year) year.textContent = new Date().getFullYear();

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
    document.body.classList.toggle('menu-open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

if (navDropdown && navDropdownToggle) {
  navDropdownToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = navDropdown.classList.toggle('open');
    navDropdownToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!navDropdown.contains(event.target)) closeDropdown();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

if (contactForm) {
  const requestedService = new URLSearchParams(window.location.search).get('dienst');
  const serviceSelect = contactForm.querySelector('select[name="dienst"]');

  if (requestedService && serviceSelect) {
    const matchingOption = [...serviceSelect.options].find((option) => option.text === requestedService);
    if (matchingOption) serviceSelect.value = matchingOption.value;
  }

  contactForm.addEventListener('submit', () => {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formNote = contactForm.querySelector('#form-note');

    submitButton.disabled = true;
    submitButton.textContent = 'Aanvraag wordt verzonden...';
    formNote.textContent = 'Een moment, uw aanvraag wordt veilig verwerkt.';
  });
}
