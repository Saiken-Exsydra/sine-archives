import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { createServer } from 'vite';
import { localUrl, runningCheckout } from './local-server.mjs';

const root = process.cwd();
const url = localUrl + '#/';

function openSite() {
  const zen = [
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Zen Browser', 'zen.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Zen Browser', 'zen.exe'),
  ].find(file => file && existsSync(file));
  const args = zen ? ['-new-tab', url] : ['/d', '/c', 'start', '""', url];
  const browser = spawn(zen ?? 'cmd.exe', args, { detached: true, stdio: 'ignore', windowsHide: true });
  browser.on('error', () => console.log(`Open ${url} in Zen Browser.`));
  browser.unref();
}

async function reuse() {
  if (!await runningCheckout(root)) return false;
  console.log(`SiNE Archives is already running at ${localUrl}`);
  openSite();
  return true;
}

async function start() {
  if (await reuse()) return;
  const server = await createServer({ root });
  try {
    await server.listen();
  } catch (error) {
    await server.close();
    if (error.code !== 'EADDRINUSE' && !/Port 5174 is already in use/.test(error.message)) throw error;
    // A second launch can arrive before the first server is ready to identify itself.
    await setTimeout(250);
    if (await reuse()) return;
    throw new Error('Port 5174 is in use. The listener did not identify this checkout. Close that process before starting SiNE Archives.');
  }
  server.printUrls();
  openSite();
}

start().catch(error => {
  console.error(`SiNE Archives: ${error.message}`);
  process.exitCode = 1;
});
