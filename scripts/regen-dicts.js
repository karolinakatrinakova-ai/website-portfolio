const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'templates');
const templates = fs.readdirSync(templatesDir).filter((d) => {
  return fs.statSync(path.join(templatesDir, d)).isDirectory();
});

let count = 0;
for (const tmpl of templates) {
  const i18nDir = path.join(templatesDir, tmpl, 'i18n');
  if (!fs.existsSync(i18nDir)) continue;

  const langs = ['en', 'sk', 'cs'];
  const out = {};
  for (const lang of langs) {
    const file = path.join(i18nDir, `${lang}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Missing: ${file}`);
      continue;
    }
    try {
      const raw = fs.readFileSync(file, 'utf8');
      out[lang] = JSON.parse(raw);
    } catch (e) {
      console.error(`Failed to parse ${file}: ${e.message}`);
      process.exit(1);
    }
  }

  const dictPath = path.join(i18nDir, 'dict.js');
  const content = `window.__sage_i18n = ${JSON.stringify(out)};`;
  fs.writeFileSync(dictPath, content, 'utf8');
  count++;
  console.log(`Wrote ${dictPath}`);
}

console.log(`\nDone — regenerated ${count} dict.js files.`);
