// Dia Tab Titles — keep the page title readable so Dia's sidebar shows it.
//
// Dia's sidebar shows the bare domain instead of a title that carries invisible
// formatting characters; some Feishu titles, for one, start with ~50 of them
// (zero-width spaces, bidi controls), apparently a watermark. Strip them, keeping only
// the joiners that hold an emoji sequence or a word together and the tag characters
// that spell subdivision flags. A page with no title at all gets one from its link
// preview title or main heading.
(() => {
  // A copy left behind by an earlier version of the extension stays in the page but is
  // cut off from it (chrome.runtime.id goes away), so only a live copy blocks this one.
  if (window.__diaTabTitlesAlive?.()) return;
  window.__diaTabTitlesAlive = () => Boolean(chrome.runtime?.id);

  const settings = { enabled: true };
  const settingsReady = chrome.storage.sync.get(settings).then((v) => Object.assign(settings, v)).catch(() => {});
  chrome.storage.onChanged.addListener((changes) => {
    if ('enabled' in changes) settings.enabled = changes.enabled.newValue;
    tidyTitle();
  });

  const FORMAT_CHAR = /\p{Cf}/u;
  const JOINABLE = /[\p{L}\p{M}\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}️]/u;

  function cleanTitle(title) {
    if (!FORMAT_CHAR.test(title)) return title;
    const chars = [...title];
    return chars.filter((c, i) => {
      if (!FORMAT_CHAR.test(c)) return true;
      if (c === '‌' || c === '‍') return JOINABLE.test(chars[i - 1] || '') && JOINABLE.test(chars[i + 1] || '');
      const cp = c.codePointAt(0);
      return cp >= 0xE0020 && cp <= 0xE007F;
    }).join('').trim();
  }

  function titleFromPage() {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content')?.trim();
    const heading = document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80);
    return cleanTitle(meta('meta[property="og:title"]') || meta('meta[name="twitter:title"]') || heading || '');
  }

  function tidyTitle() {
    if (!settings.enabled || !chrome.runtime?.id) return;
    const title = document.title;
    if (!title.trim()) {
      // Only once the page has settled: many apps fill the title in shortly after load.
      if (document.readyState !== 'complete') return;
      const borrowed = titleFromPage();
      if (borrowed) document.title = borrowed;
      return;
    }
    const cleaned = cleanTitle(title);
    if (cleaned && cleaned !== title) document.title = cleaned;
  }

  // Pages keep rewriting their titles (Feishu re-adds its characters), so watch for it.
  let observer = null;
  function watchTitle() {
    if (observer || !document.head) return;
    observer = new MutationObserver(tidyTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    tidyTitle();
  }

  settingsReady.then(() => {
    if (document.head) watchTitle();
    else document.addEventListener('DOMContentLoaded', watchTitle, { once: true });
  });
  if (document.readyState === 'complete') setTimeout(tidyTitle, 1500);
  else addEventListener('load', () => setTimeout(tidyTitle, 1500), { once: true });
})();
