(function () {
  'use strict';

  const STORAGE_KEY = 'induclean_consent_v1';
  const CONSENT_VERSION = 1;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function readStoredConsent() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== CONSENT_VERSION) return null;
      return {
        analytics: saved.analytics === true,
        marketing: saved.marketing === true
      };
    } catch (error) {
      return null;
    }
  }

  function consentParameters(choice) {
    return {
      ad_storage: choice.marketing ? 'granted' : 'denied',
      ad_user_data: choice.marketing ? 'granted' : 'denied',
      ad_personalization: choice.marketing ? 'granted' : 'denied',
      analytics_storage: choice.analytics ? 'granted' : 'denied',
      functionality_storage: 'granted',
      personalization_storage: choice.marketing ? 'granted' : 'denied',
      security_storage: 'granted'
    };
  }

  const storedConsent = readStoredConsent();
  const initialConsent = storedConsent || { analytics: false, marketing: false };

  window.gtag('consent', 'default', {
    ...consentParameters(initialConsent),
    wait_for_update: 500
  });
  window.gtag('set', 'ads_data_redaction', true);

  if (storedConsent) {
    window.dataLayer.push({
      event: 'induclean_consent_ready',
      consent_analytics: storedConsent.analytics,
      consent_marketing: storedConsent.marketing
    });
  }

  function storeConsent(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        analytics: choice.analytics,
        marketing: choice.marketing,
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      // Consent still applies for the current page when storage is unavailable.
    }

    window.gtag('consent', 'update', consentParameters(choice));
    window.dataLayer.push({
      event: 'induclean_consent_update',
      consent_analytics: choice.analytics,
      consent_marketing: choice.marketing
    });
  }

  function createConsentInterface() {
    const root = document.createElement('div');
    root.className = 'cookie-consent';
    root.id = 'cookie-consent';
    root.hidden = true;
    root.innerHTML = `
      <section class="cookie-consent-card" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description">
        <div class="cookie-consent-summary" data-consent-panel="summary">
          <p class="cookie-consent-eyebrow">Uw privacy</p>
          <h2 id="cookie-consent-title">Cookies en meten</h2>
          <p id="cookie-consent-description">Noodzakelijke opslag gebruiken we om uw keuze te onthouden. Met uw toestemming gebruiken we analytische en marketingtechnieken om de website en campagnes te meten. U kunt uw keuze later altijd wijzigen.</p>
          <a class="cookie-consent-privacy" href="privacy.html">Lees de privacyverklaring</a>
          <div class="cookie-consent-actions">
            <button class="cookie-consent-button cookie-consent-button-strong" type="button" data-consent-action="reject">Alles weigeren</button>
            <button class="cookie-consent-button" type="button" data-consent-action="preferences">Voorkeuren</button>
            <button class="cookie-consent-button cookie-consent-button-strong" type="button" data-consent-action="accept">Alles accepteren</button>
          </div>
        </div>

        <div class="cookie-consent-preferences" data-consent-panel="preferences" hidden>
          <p class="cookie-consent-eyebrow">Cookievoorkeuren</p>
          <h2>Zelf kiezen</h2>
          <div class="cookie-consent-option">
            <div><strong>Noodzakelijk</strong><span>Nodig voor beveiliging en om uw keuze te onthouden.</span></div>
            <input type="checkbox" checked disabled aria-label="Noodzakelijke opslag is altijd actief">
          </div>
          <label class="cookie-consent-option">
            <div><strong>Analytisch</strong><span>Helpt ons begrijpen welke pagina’s en diensten worden bekeken.</span></div>
            <input type="checkbox" data-consent-choice="analytics">
          </label>
          <label class="cookie-consent-option">
            <div><strong>Marketing</strong><span>Maakt conversiemeting en relevante advertentiecampagnes mogelijk.</span></div>
            <input type="checkbox" data-consent-choice="marketing">
          </label>
          <div class="cookie-consent-actions">
            <button class="cookie-consent-button" type="button" data-consent-action="back">Terug</button>
            <button class="cookie-consent-button cookie-consent-button-strong" type="button" data-consent-action="save">Voorkeuren opslaan</button>
          </div>
        </div>
      </section>
    `;
    document.body.append(root);

    const summaryPanel = root.querySelector('[data-consent-panel="summary"]');
    const preferencesPanel = root.querySelector('[data-consent-panel="preferences"]');
    const analyticsChoice = root.querySelector('[data-consent-choice="analytics"]');
    const marketingChoice = root.querySelector('[data-consent-choice="marketing"]');

    function showSummary() {
      summaryPanel.hidden = false;
      preferencesPanel.hidden = true;
      root.querySelector('[data-consent-action="reject"]').focus();
    }

    function showPreferences() {
      const current = readStoredConsent() || { analytics: false, marketing: false };
      analyticsChoice.checked = current.analytics;
      marketingChoice.checked = current.marketing;
      summaryPanel.hidden = true;
      preferencesPanel.hidden = false;
      analyticsChoice.focus();
    }

    function closeInterface() {
      root.hidden = true;
      document.body.classList.remove('cookie-consent-open');
    }

    function openInterface(panel) {
      root.hidden = false;
      document.body.classList.add('cookie-consent-open');
      if (panel === 'preferences') showPreferences();
      else showSummary();
    }

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-consent-action]');
      if (!button) return;

      const action = button.dataset.consentAction;
      if (action === 'accept') {
        storeConsent({ analytics: true, marketing: true });
        closeInterface();
      }
      if (action === 'reject') {
        storeConsent({ analytics: false, marketing: false });
        closeInterface();
      }
      if (action === 'preferences') showPreferences();
      if (action === 'back') showSummary();
      if (action === 'save') {
        storeConsent({
          analytics: analyticsChoice.checked,
          marketing: marketingChoice.checked
        });
        closeInterface();
      }
    });

    const footerTarget = document.querySelector('.footer-legal') || document.querySelector('.footer-bottom');
    if (footerTarget) {
      const settingsButton = document.createElement('button');
      settingsButton.className = 'cookie-settings-link';
      settingsButton.type = 'button';
      settingsButton.textContent = 'Cookievoorkeuren';
      settingsButton.addEventListener('click', () => openInterface('preferences'));
      footerTarget.append(settingsButton);
    }

    window.InducleanConsent = {
      get: readStoredConsent,
      open: () => openInterface('preferences')
    };

    if (!storedConsent) openInterface('summary');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createConsentInterface, { once: true });
  } else {
    createConsentInterface();
  }
})();
