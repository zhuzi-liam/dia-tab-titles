// Tabs opened before an install or update only have the old, disconnected content
// script (or none), so their titles would stay as they are until reloaded. Inject the
// current script instead.
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  await Promise.all(tabs.map((tab) =>
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] })
      .catch(() => {}))); // pages extensions may not touch (e.g. the Chrome Web Store)
});
