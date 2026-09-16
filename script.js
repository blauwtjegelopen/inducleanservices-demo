const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navDropdown = document.querySelector('.nav-dropdown');
const navDropdownToggle = document.querySelector('.nav-dropdown-toggle');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contact-form');
const whatsappUrl = 'https://wa.me/31103220272?text=Goedendag%20Induclean%2C%20ik%20neem%20contact%20op%20via%20de%20website%20en%20wil%20graag%20informatie%20over%20jullie%20diensten.';

const whatsappLink = document.createElement('a');
whatsappLink.className = 'whatsapp-float';
whatsappLink.href = whatsappUrl;
whatsappLink.target = '_blank';
whatsappLink.rel = 'noopener noreferrer';
whatsappLink.setAttribute('aria-label', 'Neem contact op met Induclean via WhatsApp op +31 10 322 0272');
whatsappLink.innerHTML = `
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M16 3.2A12.6 12.6 0 0 0 5.4 22.6L3.7 28.8l6.4-1.7A12.6 12.6 0 1 0 16 3.2Zm0 22.9c-2 0-3.8-.6-5.4-1.5l-.4-.2-3.8 1 1-3.7-.2-.4a10.2 10.2 0 1 1 8.8 4.8Zm5.6-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-1.9-.9-3.2-1.7-4.4-3.9-.3-.6.3-.6.9-1.8.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3s1.3 3.5 1.5 3.8c.2.2 2.5 3.9 6.2 5.4 2.3 1 3.2 1.1 4.4.9.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/>
  </svg>
  <span class="whatsapp-float-label">WhatsApp</span>
`;
document.body.append(whatsappLink);

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
