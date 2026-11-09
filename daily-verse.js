// Reload the daily NIV embed if the homepage stays open across midnight in Georgia.
const dailyVerseFrame = document.getElementById('daily-niv-verse');
const georgiaDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
let verseDate = georgiaDate.format(new Date());

function refreshDailyVerse() {
  const today = georgiaDate.format(new Date());
  if (today === verseDate) return;

  const url = new URL(dailyVerseFrame.src);
  url.searchParams.set('_date', today);
  dailyVerseFrame.src = url.href;
  verseDate = today;
}

setInterval(refreshDailyVerse, 60_000);
document.addEventListener('visibilitychange', refreshDailyVerse);
