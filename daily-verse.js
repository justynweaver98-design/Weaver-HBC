const verseReading = document.getElementById('verse-reading');
const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const verseFallback = document.getElementById('verse-fallback');

const georgiaDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
let requestedDate;
let retryAfter = 0;
let pendingFrame;

function refreshDailyVerse() {
  const now = new Date();
  const today = georgiaDate.format(now);
  if (pendingFrame || (today === requestedDate && now.getTime() < retryAfter)) return;

  requestedDate = today;
  retryAfter = now.getTime() + 15 * 60_000;
  const endpoint = new URL('https://www.biblegateway.com/votd/get/');
  endpoint.search = new URLSearchParams({
    format: 'json',
    version: 'NIV',
    callback: 'receiveBibleGatewayVerse',
    _date: today,
  });

  // The feed uses JSONP. Run it in a sandbox with an opaque origin.
  const frame = document.createElement('iframe');
  frame.hidden = true;
  frame.title = 'Bible Gateway verse feed';
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.srcdoc = `<!doctype html><meta name="referrer" content="no-referrer">
    <script>
      function receiveBibleGatewayVerse(data) {
        parent.postMessage(data.votd, ${JSON.stringify(window.location.origin)});
      }
    </script>
    <script src="${endpoint.href.replaceAll('&', '&amp;')}"></script>`;

  function cleanup() {
    window.removeEventListener('message', receiveVerse);
    clearTimeout(timeout);
    frame.remove();
    pendingFrame = null;
  }

  function receiveVerse(event) {
    if (event.source !== frame.contentWindow || event.origin !== 'null') return;
    const verse = event.data;
    cleanup();
    if (verse?.version_id !== 'NIV' || typeof verse.rawtext !== 'string' || typeof verse.display_ref !== 'string') return;

    const text = verse.rawtext.trim();
    const reference = verse.display_ref.trim();
    if (!text || !reference) return;

    const passage = new URL('https://www.biblegateway.com/passage/');
    passage.search = new URLSearchParams({ search: reference, version: 'NIV' });
    verseText.textContent = text;
    verseReference.textContent = reference;
    verseReference.href = passage.href;
    verseReading.hidden = false;
    verseFallback.hidden = true;
    retryAfter = Infinity;
  }

  pendingFrame = frame;
  window.addEventListener('message', receiveVerse);
  const timeout = setTimeout(cleanup, 12_000);
  document.body.append(frame);
}

refreshDailyVerse();
setInterval(refreshDailyVerse, 60_000);
document.addEventListener('visibilitychange', refreshDailyVerse);
