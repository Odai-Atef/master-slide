const { chromium } = require('/Users/odai/mcp-word/node_modules/playwright');
const fs = require('fs');

function chunkText(text, maxLen = 200) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLen) current = next;
    else {
      if (current) chunks.push(current);
      if (word.length > maxLen) {
        let remaining = word;
        while (remaining.length > maxLen) {
          chunks.push(remaining.slice(0, maxLen));
          remaining = remaining.slice(maxLen);
        }
        current = remaining;
      } else current = word;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function waitForResult(page, previousText, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const state = await page.evaluate(() => {
      const btn = document.querySelector('#humanizeBtn');
      const out = document.querySelector('[id*=result], .result, #result');
      const edits = [...document.querySelectorAll('[contenteditable="true"]')].map(e => ({ id: e.id, text: e.innerText || '' }));
      const visibleText = document.body.innerText;
      return {
        btnDisabled: !!btn?.disabled,
        btnText: btn?.innerText || '',
        edits,
        visibleText,
        outText: out?.innerText || ''
      };
    });

    const candidateTexts = [];
    if (state.outText) candidateTexts.push(state.outText.trim());
    for (const e of state.edits) {
      if (e.id !== 'tmessage' && e.text.trim()) candidateTexts.push(e.text.trim());
    }

    const useful = candidateTexts.find(t => t && t !== previousText && t.length > 20);
    if (useful) return useful;

    // fallback heuristics from visible page text
    if (!state.btnDisabled) {
      // generation appears finished but no structured output found yet
    }
    await page.waitForTimeout(3000);
  }
  throw new Error('Timed out waiting for humanized result');
}

(async () => {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    console.error('Usage: node aihumanize_automation.js <input.txt> <output.txt>');
    process.exit(1);
  }
  const input = fs.readFileSync(inputPath, 'utf8').trim();
  const chunks = chunkText(input, 200);
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://aihumanize.io/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const outputs = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Processing chunk ${i+1}/${chunks.length}: ${chunk.length} chars`);

    await page.evaluate((text) => {
      const el = document.querySelector('[contenteditable="true"].editable-div');
      if (!el) throw new Error('Input editor not found');
      el.focus();
      el.innerText = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, chunk);

    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => /Humanize AI Text/i.test(b.innerText || ''));
      if (!btn) throw new Error('Humanize button not found');
      btn.click();
    });

    const result = await waitForResult(page, chunk);
    outputs.push(result);
    fs.writeFileSync(outputPath, outputs.join('\n\n'), 'utf8');

    await page.waitForTimeout(3000);
  }

  await browser.close();
  console.log(`Saved to ${outputPath}`);
})();
