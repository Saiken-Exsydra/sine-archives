import { createHash } from 'node:crypto';
import { realpathSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

export const localServer = { host: 'localhost', port: 5174, strictPort: true };
export const localUrl = `http://${localServer.host}:${localServer.port}/`;
const statusPath = '/__sine_local_status';

function checkoutId(directory) {
  const real = realpathSync(directory);
  return createHash('sha256').update(process.platform === 'win32' ? real.toLowerCase() : real).digest('hex');
}

export function localStatusPlugin() {
  return {
    name: 'sine-local-status',
    apply: 'serve',
    configureServer(server) {
      const id = checkoutId(server.config.root);
      server.middlewares.use((request, response, next) => {
        if (request.method !== 'GET' || request.url !== statusPath) return next();
        response.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
        response.end(id);
      });
    },
  };
}

// Check both localhost families so the launcher can identify a listener even if
// the browser and Node resolved localhost in different orders.
export async function runningCheckout(directory) {
  const expected = checkoutId(path.resolve(directory));
  const probe = hostname => new Promise(resolve => {
    const request = http.get({ hostname, port: localServer.port, path: statusPath, timeout: 800 }, response => {
      let value = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        value += chunk;
        if (value.length > 64) request.destroy();
      });
      response.on('end', () => resolve(response.statusCode === 200 && value === expected));
      response.on('error', () => resolve(false));
      response.on('aborted', () => resolve(false));
    });
    request.on('timeout', () => request.destroy());
    request.on('error', () => resolve(false));
  });
  return (await Promise.all(['127.0.0.1', '::1'].map(probe))).includes(true);
}
