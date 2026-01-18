let allCodes = [];

document.getElementById('scan').onclick = async () => {
  document.getElementById('status').textContent = '🔍 Escaneando página...';

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CODES_FOUND') {
    allCodes = msg.blocks;

    document.getElementById('status').textContent =
      `✅ ${allCodes.length} blocos de código detectados`;
  }
});

document.getElementById('zip').onclick = async () => {
  if (!allCodes.length) {
    document.getElementById('status').textContent =
      '⚠️ Nenhum código capturado ainda';
    return;
  }

  const limit = parseInt(document.getElementById('limit').value) || 5;
  const selected = allCodes.slice(-limit);

  const zip = new JSZip();

  selected.forEach(file => {
    zip.file(file.filename, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url,
    filename: 'ai-codes.zip',
    saveAs: true
  });

  document.getElementById('status').textContent =
    `⬇️ Baixando ${selected.length} arquivos`;
};
