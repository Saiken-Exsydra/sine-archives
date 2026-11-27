import { createHash } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { open, readFile, realpath } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

export const reviewPath = '/__review/';
export const reviewMarker = 'active';

export function reviewDirectory(checkout) {
  const root = realpathSync(checkout);
  const windows = process.platform === 'win32';
  const temp = windows ? path.join(homedir(), 'AppData', 'Local', 'Temp') : tmpdir();
  const key = createHash('sha256').update(windows ? root.toLowerCase() : root).digest('hex').slice(0, 20);
  return path.join(temp, `sine-character-review-${key}`);
}

const mediaTypes = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'], ['.svg', 'image/svg+xml'], ['.webp', 'image/webp'],
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.avif', 'image/avif'],
  ['.woff', 'font/woff'], ['.woff2', 'font/woff2'],
]);
const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
const localSocket = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

function reply(response, code, message) {
  response.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(message);
}

function inside(directory, file) {
  const relative = path.relative(directory, file);
  return relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function serveReview(directory, request, response) {
  if (!localSocket.has(request.socket.remoteAddress) || !localHost.test(request.headers.host ?? '')) {
    return reply(response, 403, 'Character review is available on this computer only.');
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return reply(response, 405, 'Method unavailable.');

  // Connect removes the mount prefix. Only the built index and static assets are served.
  let resource;
  try { resource = decodeURIComponent(request.url.split('?')[0]).replace(/^\//, '') || 'index.html'; }
  catch { return reply(response, 400, 'Invalid review path.'); }
  if (resource !== 'index.html' && !/^(assets|media)\/(?:[\w-]+\/)*[\w.-]+$/.test(resource)) {
    return reply(response, 404, 'Review file not found.');
  }
  const contentType = mediaTypes.get(path.extname(resource));
  if (!contentType) return reply(response, 404, 'Review file not found.');

  const active = (await readFile(path.join(directory, reviewMarker), 'utf8')).trim();
  if (!/^build-[\w-]+$/.test(active)) return reply(response, 404, 'No character review is staged.');
  const root = await realpath(path.join(directory, active));
  const file = await realpath(path.resolve(root, resource));
  if (!inside(await realpath(directory), root) || !inside(root, file)) return reply(response, 404, 'Review file not found.');

  const handle = await open(file, 'r');
  try {
    const stats = await handle.stat();
    if (!stats.isFile()) return reply(response, 404, 'Review file not found.');
    response.writeHead(200, {
      'Content-Type': contentType, 'Content-Length': stats.size, 'Cache-Control': 'no-store',
      'Cross-Origin-Resource-Policy': 'same-origin', 'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else await pipeline(handle.createReadStream({ autoClose: false }), response);
  } finally {
    await handle.close();
  }
}

export function characterReviewPlugin(directoryFor = reviewDirectory) {
  return {
    name: 'sine-character-review',
    apply: 'serve',
    configureServer(server) {
      const directory = directoryFor(server.config.root);
      server.middlewares.use(reviewPath.slice(0, -1), (request, response) => {
        serveReview(directory, request, response).catch(error => {
          if (response.destroyed) return;
          if (response.headersSent) response.destroy(error);
          else if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
            reply(response, 404, 'No character review is staged, or this review file is unavailable.');
          } else {
            server.config.logger.error(`Character review: ${error.message}`);
            reply(response, 500, 'Could not load the character review.');
          }
        });
      });
    },
  };
}
