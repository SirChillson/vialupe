// Pulls recent posts from the Substack RSS feed at build time.
// Set "substackFeed" in _data/site.json (e.g. "https://vialupe.substack.com/feed").
// If the feed is unset or unreachable, the Writing page falls back to local posts.
const site = require("./site.json");

function pick(item, tag) {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

module.exports = async function () {
  if (!site.substackFeed) return [];
  try {
    const res = await fetch(site.substackFeed, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    return items.map((item) => ({
      title: decode(pick(item, "title")),
      url: pick(item, "link"),
      date: new Date(pick(item, "pubDate")),
      summary: decode(pick(item, "description")),
    }));
  } catch (err) {
    console.warn(`[substack] Could not load feed: ${err.message}`);
    return [];
  }
};
