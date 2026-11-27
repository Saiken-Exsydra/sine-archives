import { expect, test } from './browser';
import { build } from 'vite';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

test('approved bilingual dossier expands in place and restores examination under a nested base', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const root = info.outputPath('publication');
  await cp('src', path.join(root, 'src'), { recursive: true });
  await cp('index.html', path.join(root, 'index.html'));
  const id = 'lenore-engelmeyer';
  const folder = path.join(root, 'src/content/characters', id);
  const record = path.join(folder, 'record.json');
  await writeFile(record, JSON.stringify({ ...JSON.parse(await readFile(record, 'utf8')), dossier: ['en', 'pt-BR'] }));
  for (const locale of ['en', 'pt-BR']) {
    const pt = locale === 'pt-BR';
    const paragraph = pt ? 'Esta edição de estudo demonstra a leitura de um registro longo. ' : 'This study edition demonstrates how a long archival record reads. ';
    const sections = Array.from({length: 18}, (_, i) => '## ' + (pt ? 'Registro ' : 'Record ') + (i + 1) + '\n\n' + paragraph.repeat(18));
    await writeFile(path.join(folder, 'dossier.' + locale + '.md'), [
      '# ' + (pt ? 'Edição de estudo' : 'Study edition'), paragraph,
      '> ' + (pt ? 'Documento de demonstração para revisão de leitura.' : 'A specimen document for review of the reading environment.'),
      '## Memória', pt ? '- *Transcrição*\n- **Nota editorial**' : '- *Transcription*\n- **Editorial note**', '### Memória',
      '| Catalogue | Classification | Jurisdiction | Designation | Identification | Chronology |\n|---|---|---|---|---|---|\n| I | II | III | IV | V | VI |',
      '### Memória-2', '---', ...sections, '<img src=x onerror="window.unsafe=true">', '[unsafe](javascript:void(0))'
    ].join('\n\n'));
  }
  const single = path.join(root,'src/content/characters/hisui-kirasagi');
  const singleRecord = path.join(single,'record.json');
  await writeFile(singleRecord, JSON.stringify({...JSON.parse(await readFile(singleRecord,'utf8')), dossier:['en']}));
  await writeFile(path.join(single,'dossier.en.md'),'# Study edition');
  const dist = path.join(root, 'dist');
  await build({root, configFile:path.resolve('vite.config.ts'),base:'/exhibit/', publicDir:path.resolve('public'),
    logLevel:'silent',build:{outDir:dist}});
  async function serve(target: typeof page) {
    await target.route('**/exhibit/**', route => {
      const name = new URL(route.request().url()).pathname.slice('/exhibit/'.length) || 'index.html';
      return route.fulfill({path:path.join(dist,name)});
    });
  }
  await serve(page);
  const url = '/exhibit/#/characters/' + id;
  await page.setViewportSize({width:1440,height:900});
  await page.goto(url + '/abilities');
  const hero = page.locator('.character-exhibit .scene-art');
  await hero.evaluate((el: HTMLImageElement) => el.decode());
  const image = await hero.elementHandle();
  const original = await hero.boundingBox();
  const entry = page.getByRole('link',{name:'Complete Dossier', exact:true});
  const close = page.getByRole('link',{name:/^(Close Dossier|Fechar Dossiê)$/});
  const surface = page.locator('.dossier-surface:not([inert])');
  const reader = surface.getByRole('region',{name:/^(Document|Documento)$/});
  await expect(entry).toBeVisible();
  await expect(close).toHaveCount(0);
  const relationsBox = (await page.getByRole('tab',{name:'Relations',exact:true}).boundingBox())!;
  expect((await entry.boundingBox())!.y).toBeGreaterThan(relationsBox.y + relationsBox.height);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path:'test-results/react-review/dossier-examination.png'});
  await entry.focus();
  await page.keyboard.press('Enter');
  await expect(close).toHaveText('Close Dossier');
  await expect(close).toBeFocused();
  await expect(entry).toHaveCount(0);
  await expect(page.locator('#dossier-memória-2-2')).toHaveCount(1);
  await expect(page.locator('.dossier-scroll img, .dossier-scroll a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.getByRole('tablist')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Registry of Individuals' })).toHaveCount(0);
  const fullscreen = page.locator('.fullscreen-control');
  await fullscreen.click();
  await expect.poll(() => page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);
  await expect(close).toBeInViewport();
  await fullscreen.click();
  await expect.poll(() => page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(false);
  const rail = page.locator('#dossier-contents');
  await rail.getByRole('link',{name:'Record 12',exact:true}).click();
  await expect(rail.locator('[aria-current]')).toHaveText('Record 12');
  await expect(page).toHaveURL(/\/dossier\?heading=record-12$/);
  await reader.focus();
  await page.keyboard.press('End');
  await expect(rail.locator('[aria-current]')).toHaveText('Record 18');
  await reader.hover();
  await page.mouse.wheel(0,-1400);
  await expect(rail.locator('[aria-current]')).not.toHaveText('Record 18');
  await page.goBack();
  await expect(entry).toBeFocused();
  await expect(page.getByRole('tab',{name:'Abilities'})).toHaveAttribute('aria-selected','true');
  await page.goForward();
  await expect(reader.getByRole('heading',{name:'Record 12',exact:true})).toBeFocused();
  await page.getByRole('link',{name:'Português (BR)'}).click();
  await expect(reader.getByRole('heading',{name:'Edição de estudo'})).toBeVisible();
  await expect(close).toHaveText('Fechar Dossiê');
  async function settled() {
    await page.evaluate(async () => {
      await document.fonts.ready;
      const animations = document.querySelector('.character-exhibit')!.getAnimations({subtree:true});
      await Promise.allSettled(animations.filter(a => a.effect?.getComputedTiming().endTime !== Infinity).map(a=>a.finished));
    });
  }
  for (const [width,height] of [[1440,900],[2400,1000],[820,1024],[390,844]]) {
    await page.setViewportSize({width,height});
    await settled();
    await expect(surface).toHaveCSS('--dossier-cut', '0%');
    expect(await reader.evaluate(el=>el.clientWidth >= el.scrollWidth)).toBe(true);
    const plane = (await surface.boundingBox())!;
    const documentBox = (await reader.boundingBox())!;
    const mast = (await surface.locator('.dossier-mast h1').boundingBox())!;
    const column = (await reader.locator('article').boundingBox())!;
    const closeBox = (await close.boundingBox())!;
    expect(plane.x + plane.width).toBeCloseTo(width);
    expect(plane.y + plane.height).toBeCloseTo(height);
    expect(mast.x).toBeCloseTo(column.x);
    expect(closeBox.height).toBeGreaterThanOrEqual(44);
    if (width > 700) expect(closeBox.x + closeBox.width).toBeLessThan(plane.x);
    else expect(closeBox.y).toBeGreaterThan(documentBox.y + documentBox.height);
    if (width > 1000) expect((await rail.boundingBox())!.x).toBeGreaterThan(column.x + column.width);
    await page.screenshot({path:'test-results/react-review/dossier-' + width + '.png'});
    expect(await hero.evaluate((el,original)=>el===original,image)).toBe(true);
    const position = (await hero.boundingBox())!;
    expect(width > 700 ? position.x : position.y).toBeLessThan(0);
  }
  await page.locator('.contents-toggle').click();
  await rail.getByRole('link',{name:'Memória',exact:true}).last().click();
  const table = reader.locator('.dossier-table');
  await expect(table).toBeInViewport();
  await table.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => table.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  const closeBeforeScroll = await close.boundingBox();
  await page.locator('.contents-toggle').click();
  await rail.getByRole('link',{name:'Registro 7',exact:true}).click();
  await expect(page.locator('.contents-toggle')).toHaveAttribute('aria-expanded','false');
  expect(await close.boundingBox()).toEqual(closeBeforeScroll);
  await close.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link',{name:'Dossiê completo',exact:true})).toBeFocused();
  await expect(page.getByRole('tab',{name:'Habilidades'})).toHaveAttribute('aria-selected','true');
  await page.setViewportSize({width:1440,height:900});
  await settled();
  expect(await hero.boundingBox()).toEqual(original);
  // Interrupt both directions before the shared settling interval has elapsed.
  await page.locator('.dossier-entry').evaluate((el:HTMLAnchorElement)=>el.click());
  await close.evaluate((el:HTMLAnchorElement)=>el.click());
  await page.locator('.dossier-entry').evaluate((el:HTMLAnchorElement)=>el.click());
  await expect(close).toBeFocused();
  await expect(page.locator('.dossier-surface')).toHaveCount(1);
  await page.goto(url + '/dossier');
  await expect(close).toHaveAttribute('href','#/characters/' + id);
  await close.click();
  await expect(page.locator('.dossier-entry')).toBeFocused();
  await expect(page.locator('#tab-overview')).toHaveAttribute('aria-selected','true');
  await page.goto('/exhibit/?lang=en#/characters/' + id + '/dossier?heading=record-8');
  await expect(rail.locator('[aria-current]')).toHaveText('Record 8');
  await page.goto('/exhibit/?lang=en#/characters/hisui-kirasagi/dossier');
  await expect(page.locator('.dossier-surface:not([inert]) .dossier-mast h1')).toHaveText('Hisui Kirasagi');
  await expect(reader.getByRole('heading')).toHaveText(['Study edition']);
  await page.getByRole('link',{name:'Português (BR)'}).click();
  await expect(page).toHaveURL(/lang=pt-br#\/characters\/hisui-kirasagi\/dossier$/);
  await expect(surface.locator('.dossier-mast')).toContainText('Texto em inglês');
  await expect(reader.locator('article')).toHaveAttribute('lang','en');
  await expect(reader.getByRole('heading')).toHaveText(['Study edition']);
  await page.getByRole('link',{name:'Fechar Dossiê',exact:true}).click();
  await expect(close).toHaveCount(0);
  await page.getByRole('link',{name:'Dossiê completo',exact:true}).click();
  await expect(reader.getByRole('heading')).toHaveText(['Study edition']);
  const touch = await browser.newContext({baseURL:'http://127.0.0.1:4175',hasTouch:true, viewport:{width:390,height:844},reducedMotion:'reduce'});
  try {
    const mobile = await touch.newPage();
    await serve(mobile);
    await mobile.goto(url);
    await mobile.locator('.dossier-entry').tap();
    await expect(mobile.locator('.dossier-surface')).toHaveCSS('--dossier-cut', '0%');
    await expect(mobile.locator('.character-exhibit .scene-art')).toHaveCSS('transition-duration', '0s');
    await mobile.locator('.contents-toggle').tap();
    await mobile.locator('#dossier-contents a').last().tap();
    await expect(mobile.locator('#dossier-contents [aria-current]')).toHaveText('Record 18');
    await mobile.getByRole('link',{name:'Close Dossier',exact:true}).tap();
    await expect(mobile.locator('.dossier-surface')).toHaveCount(0);
    await expect(mobile.locator('.dossier-entry')).toBeFocused();
    await expect(mobile.getByRole('tab',{name:'Overview'})).toHaveAttribute('aria-selected','true');
  } finally { await touch.close(); }
});
