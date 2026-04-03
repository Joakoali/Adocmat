import { readFileSync, writeFileSync, mkdirSync } from 'fs';
mkdirSync('dist', { recursive: true });
const html = readFileSync('index.html', 'utf8')
  .replace('/src/main.tsx', '/assets/main.js')
  .replace('</head>', '<link rel="stylesheet" href="/assets/main.css" /></head>');
writeFileSync('dist/index.html', html);
console.log('dist/index.html created');
