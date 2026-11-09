// King James Version verses, rotated by the calendar date in Middle Georgia.
const verses = [
  ['Psalm 127:1', 'Except the LORD build the house, they labour in vain that build it: except the LORD keep the city, the watchman waketh but in vain.'],
  ['Proverbs 16:3', 'Commit thy works unto the LORD, and thy thoughts shall be established.'],
  ['Psalm 118:24', 'This is the day which the LORD hath made; we will rejoice and be glad in it.'],
  ['Philippians 4:13', 'I can do all things through Christ which strengtheneth me.'],
  ['Proverbs 3:5', 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.'],
  ['Psalm 46:1', 'God is our refuge and strength, a very present help in trouble.'],
  ['Matthew 5:16', 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.'],
  ['Psalm 23:1', 'The LORD is my shepherd; I shall not want.'],
  ['James 1:5', 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.'],
  ['Psalm 119:105', 'Thy word is a lamp unto my feet, and a light unto my path.'],
  ['Colossians 3:23', 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men;'],
  ['1 Corinthians 16:14', 'Let all your things be done with charity.'],
  ['Psalm 37:5', 'Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.'],
  ['Hebrews 11:1', 'Now faith is the substance of things hoped for, the evidence of things not seen.'],
  ['Proverbs 3:6', 'In all thy ways acknowledge him, and he shall direct thy paths.'],
  ['Romans 12:12', 'Rejoicing in hope; patient in tribulation; continuing instant in prayer;'],
  ['1 Peter 5:7', 'Casting all your care upon him; for he careth for you.'],
  ['John 14:27', 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.'],
  ['Psalm 121:2', 'My help cometh from the LORD, which made heaven and earth.'],
  ['Ecclesiastes 3:1', 'To every thing there is a season, and a time to every purpose under the heaven:'],
  ['Proverbs 27:17', 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.'],
  ['Psalm 34:8', 'O taste and see that the LORD is good: blessed is the man that trusteth in him.'],
  ['Galatians 6:9', 'And let us not be weary in well doing: for in due season we shall reap, if we faint not.'],
  ['Isaiah 26:3', 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.'],
  ['2 Timothy 1:7', 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.'],
  ['Proverbs 24:3', 'Through wisdom is an house builded; and by understanding it is established:'],
  ['Matthew 7:12', 'Therefore all things whatsoever ye would that men should do to you, do ye even so to them: for this is the law and the prophets.'],
  ['Psalm 19:14', 'Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight, O LORD, my strength, and my redeemer.'],
  ['Philippians 4:4', 'Rejoice in the Lord alway: and again I say, Rejoice.'],
  ['Psalm 90:17', 'And let the beauty of the LORD our God be upon us: and establish thou the work of our hands upon us; yea, the work of our hands establish thou it.'],
  ['1 Thessalonians 5:18', 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.'],
];

const georgiaDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});
const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');

function showDailyVerse() {
  const parts = Object.fromEntries(georgiaDate.formatToParts(new Date()).map(({ type, value }) => [type, Number(value)]));
  const day = Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
  const index = ((day % verses.length) + verses.length) % verses.length;
  const [reference, verse] = verses[index];
  const citation = reference + ' (KJV)';

  if (verseReference.textContent !== citation) {
    verseText.textContent = verse;
    verseReference.textContent = citation;
  }
}

showDailyVerse();
setInterval(showDailyVerse, 60_000);
document.addEventListener('visibilitychange', showDailyVerse);
