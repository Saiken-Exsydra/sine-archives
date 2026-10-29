import { chromium, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const [action, first, second, ...flags] = process.argv.slice(2);
const root = path.resolve('.tmp/visual-design-lab');
const captureRoot = path.join(root, 'captures');
function label(value) {
  if (!value || !/^[a-z0-9][a-z0-9_-]{0,39}$/.test(value)) throw new Error('Use a short lowercase capture label, for example baseline or spacing-01.');
  return value;
}
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

if (action === 'capture') {
  const name = label(first);
  const args = [second, ...flags].filter(Boolean);
  if (args.some((arg, index) => index > 1 || (index === 0 && arg !== '--route'))) throw new Error('Usage: capture <label> [--route /_lab/visual-design/]');
  const route = args[0] === '--route' ? args[1] : '/_lab/visual-design/';
  if (!route || !/^\/[a-zA-Z0-9_/-]+\/$/.test(route)) throw new Error('The route must be an absolute local path ending with /.');
  const base = new URL(process.env.VISUAL_LAB_URL || 'http://127.0.0.1:4321');
  if (base.protocol !== 'http:' || !['127.0.0.1','localhost','[::1]'].includes(base.hostname) || base.username || base.password) throw new Error('VISUAL_LAB_URL must be a local HTTP development server.');
  await mkdir(captureRoot, {recursive:true});
  const directory = path.join(captureRoot, name);
  await mkdir(directory); // Refuse to overwrite an earlier capture.
  const browser = await chromium.launch();
  const context = await browser.newContext({reducedMotion:'reduce',colorScheme:'dark'});
  const page = await context.newPage();
  const errors = [];
  const captures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  async function visit(urlPath) {
    const response = await page.goto(new URL(urlPath, base).href, {waitUntil:'domcontentloaded'});
    if (response?.status() !== 200) throw new Error(`${urlPath}: HTTP ${response?.status()}`);
    await expect(page.locator('html')).toHaveClass(/is-page-ready/, {timeout:30_000});
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0, {timeout:30_000});
    if (await page.locator('astro-island').count()) {
      // Astro removes its SSR marker before React's transition necessarily commits.
      // Exercise a real state change before screenshot's temporary caret styles run.
      const portuguese = await page.locator('html').getAttribute('lang') === 'pt-BR';
      const notes = page.getByRole('button',{name:portuguese?'Notas de revisão':'Review notes',exact:true});
      await notes.click();
      await expect(notes).toHaveAttribute('aria-pressed','true');
      const overview = page.getByRole('button',{name:portuguese?'Visão geral':'Overview',exact:true});
      await overview.click();
      await expect(overview).toHaveAttribute('aria-pressed','true');
    }
  }
  async function snapshot(surface, width) {
    const file = `${surface}-${width}.png`;
    const buffer = await page.screenshot({path:path.join(directory,file),fullPage:true,animations:'disabled'});
    captures.push({surface,width,file,sha256:createHash('sha256').update(buffer).digest('hex')});
  }
  try {
    for (const width of [390,1440]) {
      await page.setViewportSize({width,height:width < 768 ? 844 : 1000});
      await visit(route);
      await snapshot('lab-default',width);
      await page.getByRole('button',{name:'Review notes',exact:true}).click();
      await page.getByRole('checkbox',{name:'Compact spacing'}).check();
      await page.getByRole('button',{name:'Show evaluation checklist'}).click();
      await snapshot('lab-states',width);
      await visit(`/pt-br${route}`);
      await snapshot('lab-portuguese',width);
      for (const [surface,urlPath] of [['reference-home','/'],['reference-dossier','/characters/ella-wonderwall/'],['reference-observatory','/systems/observatory/']]) {
        await visit(urlPath);
        await snapshot(surface,width);
      }
    }
  } finally {
    await browser.close();
    await writeFile(path.join(directory,'manifest.json'),JSON.stringify({name,route,base:base.origin,reducedMotion:true,captures,errors},null,2));
  }
  console.log(`Captured ${captures.length} images in ${directory}`);
  if (errors.length) { console.error(errors); process.exitCode=1; }
} else if (action === 'compare') {
  const before = label(first), after = label(second);
  const load = async name => JSON.parse(await readFile(path.join(captureRoot,name,'manifest.json'),'utf8'));
  const a = await load(before), b = await load(after);
  if (a.errors.length || b.errors.length) throw new Error('A capture recorded browser errors; inspect its manifest before comparing.');
  const rows = a.captures.map(item => {
    const next = b.captures.find(x=>x.file===item.file);
    if (!next) throw new Error(`Missing comparison image: ${item.file}`);
    const figure = (name,caption) => `<figure><figcaption>${escape(caption)}</figcaption><img src="captures/${name}/${item.file}" alt="${escape(item.surface)} at ${item.width}px" loading="lazy"></figure>`;
    return `<section><h2>${escape(item.surface)} · ${item.width}px</h2><p>${item.sha256===next.sha256?'Byte-identical capture':'Changed capture — review the images; a change is not automatically a regression.'}</p><div>${figure(before,before)}${figure(after,after)}</div></section>`;
  });
  const report=path.join(root,`compare-${before}-${after}.html`);
  await writeFile(report,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Visual design lab comparison</title><style>body{margin:2rem;background:#111;color:#eee;font:16px system-ui}section{border-top:1px solid #555;margin:2rem 0;padding:1rem 0}section>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}figure{margin:0}figcaption{margin-bottom:.7rem}img{width:100%;height:auto;border:1px solid #555}@media(max-width:700px){section>div{grid-template-columns:1fr}}</style><h1>Visual design lab comparison</h1><p>Review hierarchy, spacing, readability, focus states and production references. Matching hashes only prove identical pixels in these captures.</p>${rows.join('')}</html>`,{flag:'wx'});
  console.log(`Open ${report}`);
} else {
  throw new Error('Usage: node scripts/visual-design-lab.mjs capture <label> OR compare <before> <after>');
}
