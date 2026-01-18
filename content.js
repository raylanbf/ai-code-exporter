(() => {
  const blocks = [];

  const codeBlocks = document.querySelectorAll('pre code');

  codeBlocks.forEach((el, i) => {
    const text = el.innerText.trim();

    let filename = `code_${i + 1}.txt`;

    // 🔍 Detecta nome de arquivo no começo do código
    const filenameRegex = /^([a-zA-Z0-9_\-./]+\.(js|ts|html|css|py|php|json|md|txt))/m;
    const match = text.match(filenameRegex);

    if (match) {
      filename = match[1];
    } else {
      // 🔍 Detecta linguagem pelo class ou conteúdo
      if (text.includes('<html')) filename = `file_${i + 1}.html`;
      else if (text.includes('function') || text.includes('const '))
        filename = `file_${i + 1}.js`;
      else if (text.includes('def ') || text.includes('import '))
        filename = `file_${i + 1}.py`;
    }

    blocks.push({
      filename,
      content: text
    });
  });

  chrome.runtime.sendMessage({
    type: 'CODES_FOUND',
    blocks
  });
})();
