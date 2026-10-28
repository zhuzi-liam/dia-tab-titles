const enabled = document.getElementById('enabled');

chrome.storage.sync.get({ enabled: true }).then((s) => { enabled.checked = s.enabled; });
enabled.addEventListener('change', () => chrome.storage.sync.set({ enabled: enabled.checked }));
