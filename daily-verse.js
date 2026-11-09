// NIV readings selected for the construction homepage. A third value marks an excerpt.
const verses = [
  ["Proverbs 24:3", "By wisdom a house is built, and through understanding it is established;"],
  ["Exodus 31:3", "I have filled him with the Spirit of God, with wisdom, with understanding, with knowledge and with all kinds of skills", true],
  ["Luke 6:48", "They are like a man building a house, who dug down deep and laid the foundation on rock.", true],
  ["Proverbs 21:5", "The plans of the diligent lead to profit as surely as haste leads to poverty."],
  ["Psalm 127:1", "Unless the LORD builds the house, the builders labor in vain.", true],
  ["Colossians 3:23", "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters,"],
  ["Nehemiah 4:6", "So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart."],
  ["Proverbs 24:27", "Put your outdoor work in order and get your fields ready; after that, build your house."],
  ["Isaiah 28:16", "I lay a stone in Zion, a tested stone, a precious cornerstone for a sure foundation", true],
  ["Proverbs 22:29", "Do you see someone skilled in their work? They will serve before kings; they will not serve before officials of low rank."],
  ["Ecclesiastes 4:9", "Two are better than one, because they have a good return for their labor:"],
  ["1 Corinthians 3:10", "But each one should build with care.", true],
  ["Proverbs 15:22", "Plans fail for lack of counsel, but with many advisers they succeed."],
  ["Hebrews 3:4", "For every house is built by someone, but God is the builder of everything."],
  ["1 Chronicles 28:20", "Be strong and courageous, and do the work.", true],
  ["Proverbs 16:3", "Commit to the LORD whatever you do, and he will establish your plans."],
  ["1 Corinthians 3:11", "For no one can lay any foundation other than the one already laid, which is Jesus Christ."],
  ["Proverbs 14:23", "All hard work brings a profit, but mere talk leads only to poverty."],
  ["Psalm 90:17", "establish the work of our hands for us—yes, establish the work of our hands.", true],
  ["Matthew 7:24", "“Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock."],
  ["Proverbs 27:17", "As iron sharpens iron, so one person sharpens another."],
  ["Ephesians 2:20", "built on the foundation of the apostles and prophets, with Christ Jesus himself as the chief cornerstone."],
  ["Ecclesiastes 9:10", "Whatever your hand finds to do, do it with all your might", true],
  ["1 Peter 2:5", "you also, like living stones, are being built into a spiritual house", true],
];

const firstDay = Date.UTC(2026, 10, 9);
const georgiaDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});
const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
let displayedDay;

function refreshDailyVerse() {
  const parts = Object.fromEntries(georgiaDate.formatToParts(new Date()).map(({ type, value }) => [type, Number(value)]));
  const date = Date.UTC(parts.year, parts.month - 1, parts.day);
  const day = (date - firstDay) / 86_400_000;
  if (day === displayedDay) return;

  const index = ((day % verses.length) + verses.length) % verses.length;
  const [reference, text, excerpt] = verses[index];
  const passage = new URL('https://www.biblegateway.com/passage/');
  passage.search = new URLSearchParams({ search: reference, version: 'NIV' });
  verseText.textContent = text;
  verseReference.textContent = excerpt ? reference + ' (excerpt)' : reference;
  verseReference.href = passage.href;
  displayedDay = day;
}

refreshDailyVerse();
setInterval(refreshDailyVerse, 60_000);
document.addEventListener('visibilitychange', refreshDailyVerse);
