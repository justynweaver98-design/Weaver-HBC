(() => {
  const id = window.WHBC_ANALYTICS_ID;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const choiceKey = 'whbc-analytics-consent-v1';
  let started = false;
  let choice;
  try { choice = localStorage.getItem(choiceKey); } catch {}
  const path = location.pathname === '/index.html' ? '/' : location.pathname;
  const source = new URLSearchParams(location.search).get('utm_source');
  const knownSources = ['chatgpt.com', 'facebook', 'instagram', 'google', 'bing'];
  const pageLocation = location.origin + path + (knownSources.includes(source) ? '?utm_source=' + encodeURIComponent(source) : '');
  let referrer = '';
  try { referrer = new URL(document.referrer).origin; } catch {}
  function emit(name, data = {}) {
    if (started && choice === 'allow') window.gtag('event', name, { ...data, page_location: pageLocation, page_referrer: referrer });
  }
  let pending;
  if (path.endsWith('/thank-you.html')) {
    try {
      pending = JSON.parse(sessionStorage.getItem('whbc-pending-form'));
      sessionStorage.removeItem('whbc-pending-form');
    } catch {}
    const type = new URLSearchParams(location.search).get('type');
    if (!pending || pending.kind !== type || Date.now() - pending.time < 0 || Date.now() - pending.time > 3600000) pending = null;
  }
  function start() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: pageLocation, page_referrer: referrer });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
    emit('page_view');
    if (pending) {
      emit(pending.kind === 'project' ? 'generate_lead' : 'application_confirmation', { method: 'website_form_return' });
      pending = null;
    }
  }
  const banner = document.createElement('aside');
  banner.className = 'analytics-choice';
  banner.setAttribute('aria-label', 'Optional website analytics');
  banner.innerHTML = '<p>May we use Google Analytics to understand visits, phone-link taps, and project-form confirmations? <a href="privacy.html">Privacy details</a></p><div><button type="button" data-choice="decline">Decline</button><button type="button" data-choice="allow">Allow analytics</button></div>';
  banner.hidden = Boolean(choice);
  document.body.append(banner);
  document.querySelectorAll('[data-analytics-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
  });
  banner.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    choice = button.dataset.choice;
    try { localStorage.setItem(choiceKey, choice); } catch {}
    banner.hidden = true;
    window['ga-disable-' + id] = choice !== 'allow';
    if (choice === 'allow') start();
  }));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="tel:"]');
    if (!link) return;
    const number = link.getAttribute('href').replace(/[^0-9]/g, '');
    if (['14044448768', '16785888590'].includes(number)) emit('phone_click', { contact: number === '14044448768' ? 'scott' : 'office' });
  });
  if (choice === 'allow') start();
})();
