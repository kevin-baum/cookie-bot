(function() {
  //
  // 1) CSS als String definieren und ins <head> einfügen
  //
  var styleCSS = `
    /* Stil für den Hintergrund des Cookie-Banners */
    #cookie-banner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none; /* Wird initial ausgeblendet */
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
    }

    /* Das eigentliche Modal-Fenster */
    .cookie-modal {
        background: #fff;
        max-width: 400px;
        width: 90%;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
    }

    .cookie-modal h2 {
        margin: 0 0 10px;
        font-size: 20px;
        font-weight: bold;
    }

    .cookie-modal p {
        margin: 0 0 20px;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
    }

    .cookie-modal a {
        color: #0066cc;
        text-decoration: underline;
    }

    .cookie-modal .links {
        margin-bottom: 20px;
    }

    .cookie-modal .links a {
        margin-right: 10px;
    }

    /* Container für jede Cookie-Kategorie */
    .cookie-categories {
        margin-bottom: 20px;
    }

    .cookie-category {
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }

    /* Kopfzeile jeder Kategorie mit Toggle/Anzeige */
    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 10px 0;
    }

    .category-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: normal;
    }

    .category-header .toggle {
        display: flex;
        align-items: center;
    }

    /* Pfeil-Symbol zur Kennzeichnung expandierbarer Bereiche */
    .category-header .arrow {
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #000;
        margin-right: 10px;
        transition: transform 0.3s;
    }

    .category-header.expanded .arrow {
        transform: rotate(180deg);
    }

    /* Inhalt, der beim Klicken auf- und zugeklappt wird */
    .category-content {
        display: none;
        padding: 10px 0;
        font-size: 14px;
        color: #666;
    }

    .category-content.show {
        display: block;
    }

    /* Design für Switch-Elemente (An/Aus) */
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        vertical-align: middle;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #0066cc;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #0066cc;
    }

    input:checked + .slider:before {
        transform: translateX(20px);
    }

    .switch-label {
        margin-left: 10px;
        font-size: 14px;
        color: #666;
    }

    /* Buttons-Bereich unterhalb der Kategorien */
    .cookie-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* DSGVO-Vorschrift: Alle Buttons in gleicher Farbe */
    .cookie-buttons button {
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        background: #0066cc;
        color: #fff;
        border: 1px solid #0066cc;
    }

    /* Icon innerhalb des Cookie-Banners (optional, hier nicht eingeblendet) */
    .cookie-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
    }

    /* Button unten rechts, um die Cookie-Einstellungen erneut zu öffnen */
    #cookie-preferences-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 10001;
        display: none; /* Wird erst nach Setzen der Präferenzen angezeigt */
        align-items: center;
        justify-content: center;
    }

    #cookie-preferences-btn svg {
        width: 24px;
        height: 24px;
        fill: #0066cc;
    }
  `;

  // Style-Element in den Head einfügen
  var styleEl = document.createElement('style');
  styleEl.setAttribute('type', 'text/css');
  styleEl.appendChild(document.createTextNode(styleCSS));
  document.head.appendChild(styleEl);

  //
  // 2) HTML-Gerüst als String und ins DOM einfügen
  //
  var bannerHTML = `
<div id="cookie-banner" role="dialog" aria-modal="true" aria-label="Cookie Einstellungen">
  <div class="cookie-modal">
    <h2>Cookie Einstellungen</h2>
    <p>Wir nutzen Cookies auf unserer Website. Einige von ihnen sind essenziell, während andere uns helfen, die Website und die Erfahrung zu verbessern.</p>

    <div class="links">
      <a href="/impressum" target="_blank">Impressum</a>
      <a href="/datenschutz" target="_blank">Datenschutz</a>
      <a href="/cookie-richtlinien" target="_blank">Cookie Richtlinien</a>
    </div>

    <!-- Cookie-Kategorien -->
    <div class="cookie-categories">
      <!-- Notwendige Cookies -->
      <div class="cookie-category">
        <div class="category-header" data-target="essential-content">
          <h4>Notwendige Cookies</h4>
          <span class="arrow"></span>
        </div>
        <div id="essential-content" class="category-content">
          <p>Diese Cookies sind für die grundlegende Funktionalität der Website erforderlich und sind immer aktiv.</p>
        </div>
      </div>

      <!-- Marketing -->
      <div class="cookie-category">
        <div class="category-header" data-target="marketing-content">
          <h4>Cookies für Marketing</h4>
          <div class="toggle">
            <span class="arrow"></span>
            <label class="switch">
              <input type="checkbox" id="toggle-marketing" aria-label="Marketing Cookies aktivieren">
              <span class="slider"></span>
            </label>
            <span class="switch-label">Aus</span>
          </div>
        </div>
        <div id="marketing-content" class="category-content">
          <p>Diese Cookies werden verwendet, um personalisierte Werbung anzuzeigen und die Effektivität von Werbekampagnen zu messen.</p>
        </div>
      </div>

      <!-- Analyse -->
      <div class="cookie-category">
        <div class="category-header" data-target="analytics-content">
          <h4>Cookies für Analyse</h4>
          <div class="toggle">
            <span class="arrow"></span>
            <label class="switch">
              <input type="checkbox" id="toggle-analytics" aria-label="Analytische Cookies aktivieren">
              <span class="slider"></span>
            </label>
            <span class="switch-label">Aus</span>
          </div>
        </div>
        <div id="analytics-content" class="category-content">
          <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie anonyme Informationen sammeln.</p>
        </div>
      </div>
    </div>

    <!-- Buttons im Footer des Banners -->
    <div class="cookie-buttons">
      <button id="cookie-accept-all" aria-label="Alle Cookies akzeptieren">Alle Cookies akzeptieren</button>
      <button id="cookie-save" aria-label="Nur Auswahl speichern">Nur Auswahl speichern</button>
      <button id="cookie-reject-all" aria-label="Alle Cookies ablehnen">Alle Cookies ablehnen</button>
    </div>
  </div>
</div>

<!-- Button unten rechts, um die Cookie-Einstellungen erneut zu öffnen -->
<button id="cookie-preferences-btn" title="Cookie-Einstellungen bearbeiten" aria-label="Cookie-Einstellungen öffnen">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"/>
  </svg>
</button>
`;

  // HTML einfügen
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = bannerHTML;
  // tempDiv.firstElementChild ist #cookie-banner
  // tempDiv.children[1] ist der #cookie-preferences-btn
  while (tempDiv.firstChild) {
    document.body.appendChild(tempDiv.firstChild);
  }

  //
  // 3) Cookie-Bot-Logik (JS)
  //
  document.addEventListener('DOMContentLoaded', function() {
    // Sicherheits-Check: Cookies-Bibliothek vorhanden?
    if (typeof Cookies === 'undefined') {
      console.error('JS-Cookie-Bibliothek nicht gefunden. Bitte vor diesem Skript laden: https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/');
      return;
    }

    const COOKIE_PREFERENCES_KEY = 'cookieConsentSettings';
    let allowedCategories = { essential: true, marketing: false, analytics: false };

    // Bekannte Cookies und ihre Kategorien
    const cookieInfo = {
      '_ga':      { cat: 'analytics', desc: 'Used by Google Analytics to register a unique ID for statistical data.' },
      '_gid':     { cat: 'analytics', desc: 'Used by Google Analytics to generate statistical data.' },
      '_fbp':     { cat: 'marketing', desc: 'Used by Facebook to deliver advertising products.' },
      'PHPSESSID':{ cat: 'essential', desc: 'Stores your current session ID for site functionality.' }
    };

    function updateScriptTags() {
      const scriptTags = document.querySelectorAll('script[data-cookiecategory]');
      scriptTags.forEach((tag) => {
        const scriptCategory = tag.getAttribute('data-cookiecategory');
        const isAllowed = allowedCategories[scriptCategory];

        if (isAllowed) {
          if (tag.type === 'text/plain') {
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.textContent = tag.textContent;
            if (tag.src) {
              newScript.src = tag.src;
            }
            tag.parentNode.insertBefore(newScript, tag);
            tag.remove();
          }
        } else {
          // Entfernen, falls nicht erlaubt
          tag.remove();
        }
      });
    }

    // Cookies scannen
    function scanCookiesInBackground() {
      const allCookies = Cookies.get();
      Object.keys(allCookies).forEach((cookieName) => {
        if (!cookieInfo[cookieName]) {
          // Falls unbekannt => cat: unknown
          cookieInfo[cookieName] = { cat: 'unknown', desc: 'Automatisch erkannt.' };
        }
      });
    }

    function getAllCookiesAsArray() {
      return Object.keys(Cookies.get() || {});
    }

    function getCategory(cookieName) {
      if (!cookieInfo[cookieName] && cookieName.startsWith('_ga_')) {
        return 'analytics';
      } else if (!cookieInfo[cookieName]) {
        return 'unknown';
      }
      return cookieInfo[cookieName].cat;
    }

    function deleteCookie(name) {
      Cookies.remove(name, { path: '/' });
    }

    function savePreferences(prefs) {
      try {
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
      } catch (error) {
        console.error('Fehler beim Speichern der Einstellungen:', error);
      }
    }

    function loadPreferences() {
      try {
        const prefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        return prefs ? JSON.parse(prefs) : null;
      } catch (error) {
        console.error('Fehler beim Laden der Einstellungen:', error);
        return null;
      }
    }

    function applyPreferences(prefs) {
      allowedCategories = prefs.categories;
      const existingCookies = getAllCookiesAsArray();
      existingCookies.forEach((name) => {
        const cat = getCategory(name);
        if (cat !== 'essential' && allowedCategories[cat] !== true) {
          deleteCookie(name);
        }
      });
      updateScriptTags();
    }

    function showBanner() {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        banner.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    function hideBanner() {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        banner.style.display = 'none';
      }
      document.body.style.overflow = '';
    }

    function showPreferencesButton() {
      const prefBtn = document.getElementById('cookie-preferences-btn');
      if (prefBtn) {
        prefBtn.style.display = 'flex';
      }
    }

    function updateSwitchLabel(checkbox, label) {
      if (checkbox && label) {
        label.textContent = checkbox.checked ? 'Ein' : 'Aus';
      }
    }

    function toggleCategory(event) {
      const header = event.currentTarget;
      const targetId = header.getAttribute('data-target');
      const content = document.getElementById(targetId);
      if (content) {
        content.classList.toggle('show');
        header.classList.toggle('expanded');
      }
    }

    // 1) Hintergrundscan
    scanCookiesInBackground();

    // 2) Vorhandene Preferences laden?
    const existingPrefs = loadPreferences();
    if (existingPrefs) {
      applyPreferences(existingPrefs);
    }

    // 3) DOM-Elemente und Events
    const marketingToggle = document.getElementById('toggle-marketing');
    const marketingLabel = document.querySelector('#toggle-marketing + .slider + .switch-label');

    const analyticsToggle = document.getElementById('toggle-analytics');
    const analyticsLabel = document.querySelector('#toggle-analytics + .slider + .switch-label');

    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
      header.addEventListener('click', toggleCategory);
    });

    if (existingPrefs) {
      if (marketingToggle && marketingLabel) {
        marketingToggle.checked = existingPrefs.categories.marketing;
        updateSwitchLabel(marketingToggle, marketingLabel);
      }
      if (analyticsToggle && analyticsLabel) {
        analyticsToggle.checked = existingPrefs.categories.analytics;
        updateSwitchLabel(analyticsToggle, analyticsLabel);
      }
    }

    if (marketingToggle && marketingLabel) {
      marketingToggle.addEventListener('change', () => updateSwitchLabel(marketingToggle, marketingLabel));
    }
    if (analyticsToggle && analyticsLabel) {
      analyticsToggle.addEventListener('change', () => updateSwitchLabel(analyticsToggle, analyticsLabel));
    }

    const acceptAllBtn = document.getElementById('cookie-accept-all');
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => {
        const prefs = {
          consentGiven: true,
          categories: {
            essential: true,
            marketing: true,
            analytics: true
          }
        };
        savePreferences(prefs);
        applyPreferences(prefs);
        hideBanner();
        showPreferencesButton();
        if (marketingToggle && marketingLabel) {
          marketingToggle.checked = true;
          updateSwitchLabel(marketingToggle, marketingLabel);
        }
        if (analyticsToggle && analyticsLabel) {
          analyticsToggle.checked = true;
          updateSwitchLabel(analyticsToggle, analyticsLabel);
        }
      });
    }

    const saveBtn = document.getElementById('cookie-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const marketingChecked = marketingToggle ? marketingToggle.checked : false;
        const analyticsChecked = analyticsToggle ? analyticsToggle.checked : false;
        const prefs = {
          consentGiven: true,
          categories: {
            essential: true,
            marketing: marketingChecked,
            analytics: analyticsChecked
          }
        };
        savePreferences(prefs);
        applyPreferences(prefs);
        hideBanner();
        showPreferencesButton();
      });
    }

    const rejectAllBtn = document.getElementById('cookie-reject-all');
    if (rejectAllBtn) {
      rejectAllBtn.addEventListener('click', () => {
        const prefs = {
          consentGiven: true,
          categories: {
            essential: true,
            marketing: false,
            analytics: false
          }
        };
        savePreferences(prefs);
        applyPreferences(prefs);
        hideBanner();
        showPreferencesButton();
        if (marketingToggle && marketingLabel) {
          marketingToggle.checked = false;
          updateSwitchLabel(marketingToggle, marketingLabel);
        }
        if (analyticsToggle && analyticsLabel) {
          analyticsToggle.checked = false;
          updateSwitchLabel(analyticsToggle, analyticsLabel);
        }
      });
    }

    const prefBtn = document.getElementById('cookie-preferences-btn');
    if (prefBtn) {
      prefBtn.addEventListener('click', () => {
        showBanner();
      });
    }

    if (existingPrefs) {
      hideBanner();
      showPreferencesButton();
    } else {
      showBanner();
    }
  });
})();
