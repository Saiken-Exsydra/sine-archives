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
      '## Memória', pt ? '- *Transcrição*\n- **Nota editorial**' : '- *Transcription*\n- **Editorial note**', '### Memória', '| A | B | C | D | E |\n|---|---|---|---|---|\n| I | II | III | IV | V |',
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
  const entry = page.getByRole('link',{name:'Complete Dossier'});
  const back = page.locator('.dossier-return');
  const reader = page.locator('.dossier-surface:not([inert]) .dossier-scroll');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path:'test-results/react-review/dossier-examination.png'});
  await entry.focus();
  await page.keyboard.press('Enter');
  await expect(back).toBeFocused();
  await expect(page.locator('#dossier-memória-2-2')).toHaveCount(1);
  await expect(page.locator('.dossier-scroll img, .dossier-scroll a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.getByRole('tablist')).toHaveCount(0);
  const fullscreen = page.locator('.fullscreen-control');
  await fullscreen.click();
  await expect.poll(() => page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);
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
  async function settled() {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.allSettled(document.querySelector('.character-exhibit')!.getAnimations({subtree:true}).map(a=>a.finished));
    });
  }
  for (const [width,height] of [[1440,900],[2400,1000],[820,1024],[390,844]]) {
    await page.setViewportSize({width,height});
    await settled();
    expect(await reader.evaluate(el=>el.clientWidth >= el.scrollWidth)).toBe(true);
    await page.screenshot({path:'test-results/react-review/dossier-' + width + '.png'});
    expect(await hero.evaluate((el,original)=>el===original,image)).toBe(true);
    const position = (await hero.boundingBox())!;
    expect(width > 700 ? position.x : position.y).toBeLessThan(0);
  }
  await page.locator('.contents-toggle').click();
  await rail.getByRole('link',{name:'Registro 7',exact:true}).click();
  await expect(page.locator('.contents-toggle')).toHaveAttribute('aria-expanded','false');
  await back.click();
  await expect(page.getByRole('tab',{name:'Habilidades'})).toHaveAttribute('aria-selected','true');
  await page.setViewportSize({width:1440,height:900});
  await settled();
  expect(await hero.boundingBox()).toEqual(original);
  // Interrupt both directions before the shared settling interval has elapsed.
  await page.locator('.dossier-entry').evaluate((el:HTMLAnchorElement)=>el.click());
  await back.evaluate((el:HTMLAnchorElement)=>el.click());
  await page.locator('.dossier-entry').evaluate((el:HTMLAnchorElement)=>el.click());
  await expect(back).toBeFocused();
  await expect(page.locator('.dossier-surface')).toHaveCount(1);
  await page.goto(url + '/dossier');
  await expect(back).toHaveAttribute('href','#/characters/' + id);
  await page.goto('/exhibit/?lang=en#/characters/' + id + '/dossier?heading=record-8');
  await expect(rail.locator('[aria-current]')).toHaveText('Record 8');
  await page.goto('/exhibit/?lang=en#/characters/hisui-kirasagi/dossier');
  await expect(page.locator('.dossier-surface:not([inert]) .dossier-mast h1')).toHaveText('Hisui Kirasagi');
  await expect(reader.getByRole('heading')).toHaveText(['Study edition']);
  await page.getByRole('link',{name:'Português (BR)'}).click();
  await expect(page).toHaveURL(/hisui-kirasagi$/);
  await expect(page.locator('.dossier-entry')).toHaveCount(0);
  const touch = await browser.newContext({baseURL:'http://127.0.0.1:4175',hasTouch:true, viewport:{width:390,height:844},reducedMotion:'reduce'});
  try {
    const mobile = await touch.newPage();
    await serve(mobile);
    await mobile.goto(url);
    await mobile.locator('.dossier-entry').tap();
    await mobile.locator('.contents-toggle').tap();
    await mobile.locator('#dossier-contents a').last().tap();
    await expect(mobile.locator('#dossier-contents [aria-current]')).toHaveText('Record 18');
    await mobile.locator('.dossier-return').tap();
    await expect(mobile.locator('.dossier-entry')).toBeFocused();
    await expect(mobile.getByRole('tab',{name:'Overview'})).toHaveAttribute('aria-selected','true');
  } finally { await touch.close(); }
});
