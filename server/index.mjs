import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.mjs';

try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8' };
const server = createServer((req, res) => handleApi(req, res, async () => {
  try {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
    const file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); return res.end('Forbidden'); }
    let target = file;
    try { if (!(await stat(target)).isFile()) target = resolve(root, 'index.html'); } catch { if (extname(pathname)) { res.writeHead(404); return res.end('Not found'); } target = resolve(root, 'index.html'); }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cache-Control': target.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' }); res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(500); res.end('Build the website with npm run build before starting.'); }
}));
server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`B’s Botanicals server listening on port ${process.env.PORT || 3000}`));
