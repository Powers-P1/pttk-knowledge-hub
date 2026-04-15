import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { sourceOfTruth } from '../src/data/sourceOfTruth';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const site = process.env.SITE_URL ?? 'https://example.com/pttk-knowledge-hub';
const entries = sourceOfTruth.meta.changelog.slice().sort((a, b) => b.date.localeCompare(a.date));

const rssItems = entries.map((entry, idx) => {
  const desc = entry.details.map(d => `- ${d}`).join('\n');
  return `
    <item>
      <title>${esc(entry.title)}</title>
      <link>${site}#/zmiany</link>
      <guid>${site}#${entry.date}-${idx}</guid>
      <pubDate>${new Date(entry.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
      <category>${esc(entry.type)}</category>
    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Odznaki PTTK - Historia zmian</title>
    <link>${site}</link>
    <description>Feed zmian danych i interfejsu</description>
    <language>pl-PL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${rssItems}
  </channel>
</rss>`;

const atomEntries = entries.map((entry, idx) => {
  const content = entry.details.map(d => `<li>${esc(d)}</li>`).join('');
  return `
  <entry>
    <title>${esc(entry.title)}</title>
    <id>${site}#${entry.date}-${idx}</id>
    <updated>${entry.date}T12:00:00Z</updated>
    <link href="${site}#/zmiany" />
    <category term="${esc(entry.type)}" />
    <content type="html"><![CDATA[<ul>${content}</ul>]]></content>
  </entry>`;
}).join('\n');

const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Odznaki PTTK - Historia zmian</title>
  <id>${site}</id>
  <updated>${new Date().toISOString()}</updated>
  <link href="${site}" />
  <link rel="self" href="${site}/atom.xml" />${atomEntries}
</feed>`;

const publicDir = resolve(import.meta.dirname, '..', 'public');
writeFileSync(resolve(publicDir, 'feed.xml'), rss, 'utf-8');
writeFileSync(resolve(publicDir, 'atom.xml'), atom, 'utf-8');

console.log(`✅ Wygenerowano feedy: ${resolve(publicDir, 'feed.xml')} i ${resolve(publicDir, 'atom.xml')}`);
