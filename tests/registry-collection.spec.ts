import { test, expect } from './browser';
import { build } from 'vite';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

test('a static subdirectory build discovers 64 records and supersedes a delayed choice', async ({page}, testInfo) => {
  const root = testInfo.outputPath('publication');
  const examples = ['lenore-engelmeyer', 'hisui-kirasagi'];
  const published = path.resolve('src/content/characters');
  await cp('src', path.join(root, 'src'), { recursive: true, filter: source => {
    const [character] = path.relative(published, path.resolve(source)).split(path.sep);
    return !character || character === '..' || examples.includes(character);
  } });
  await cp('index.html', path.join(root, 'index.html'));
  const publication = path.join(root, 'src/content/characters');
  const registryFile = path.join(root, 'src/content/institutions.json');
  const institutions = JSON.parse(await readFile(registryFile, 'utf8'));
  institutions.company = { category: 'company', name: 'Example company' };
  institutions.order = { category: 'religious', name: 'Example order' };
  await writeFile(registryFile, JSON.stringify(institutions));
  const symbolsFile = path.join(root, 'src/content/classifications.json');
  const symbols = JSON.parse(await readFile(symbolsFile, 'utf8'));
  symbols.other.study = { name: 'Example classification', insignia: 'fixture-symbol' };
  await writeFile(symbolsFile, JSON.stringify(symbols));
  const manifestFile = path.join(root, 'src/images/manifest.json');
  const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  manifest['fixture-symbol'] = { profile: 'symbol', variants: [{ file: 'fixture.svg', width: 32, height: 32 }] };
  await writeFile(manifestFile, JSON.stringify(manifest));
  for (let i = 2; i < 64; i++) {
    const fixture = path.join(publication, 'fixture-' + i);
    await cp(path.join(publication, examples[i % 2]), fixture, {
      recursive: true, filter: source => !path.basename(source).startsWith('dossier.'),
    });
    const file = path.join(fixture, 'record.json');
    const { hero, portrait } = JSON.parse(await readFile(file, 'utf8'));
    await writeFile(file, JSON.stringify({
      name: 'Study ' + i, shortName: 'Study ' + i,
      designation: { en: 'Fixture', 'pt-BR': 'Exemplo' },
      summary: 'Test record', hero, portrait, overview: {},
      order: (i + 1) * 10, portraitFocal: '40% 30%',
      ...(i === 3 && {
        name: 'Study of a very long individual name with several published family names',
        affiliations: [
          { institution: 'house-wonderwall', kind: 'membership', primary: true },
          { institution: 'company', kind: 'employment' }, { institution: 'order', kind: 'association' },
        ],
        classifications: { systems: [{ system: 'divination', kind: 'affiliation' }], other: ['study'] },
        relationships: [{ character: 'fixture-2', kind: 'family' }],
      }),
    }));
    if (i === 3) await writeFile(path.join(fixture, 'biography.pt-BR.md'), 'Parágrafo de verificação. '.repeat(30).trim().concat('\n\n').repeat(20));
  }
  const result = await build({
    root, configFile: path.resolve('vite.config.ts'), base:'/exhibit/',
    publicDir:false, logLevel:'silent', build:{write:false},
  });
  const output = (Array.isArray(result) ? result[0] : result).output;
  await page.route('**/exhibit/**', async route => {
    const file = new URL(route.request().url()).pathname.slice('/exhibit/'.length) || 'index.html';
    if (file === 'media/fixture.svg') return route.fulfill({contentType:'image/svg+xml',
      body:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M2 2h28v28H2z"/></svg>'});
    if (file.startsWith('media/')) return route.fulfill({path:path.resolve('public',file)});
    const asset = output.find(item => item.fileName === file)!;
    const body = asset.type === 'chunk' ? asset.code : asset.source;
    return route.fulfill({body:typeof body === 'string' ? body : Buffer.from(body),
      contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':undefined});
  });
  await page.setViewportSize({width:2400,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/exhibit/#/characters');
  await page.locator('.registry-trigger').click();
  const links = page.locator('.registry-portrait');
  await expect(links).toHaveCount(64);
  const track = page.locator('.registry-track');
  expect(await track.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0);
  await track.hover();
  const before = await track.evaluate(el=>el.scrollTop);
  await page.mouse.wheel(0,360);
  await expect.poll(()=>track.evaluate(el=>el.scrollTop)).toBeGreaterThan(before);
  await page.screenshot({path:'test-results/react-review/registry-ultrawide-fixture.png'});
  await page.keyboard.press('Escape');
  await page.locator('.registry-trigger').click();
  expect(await track.evaluate(el=>el.scrollTop)).toBeGreaterThan(before);
  await expect(page.getByRole('button', {name: 'Return to record'})).toBeFocused();
  await links.nth(8).focus();
  await page.keyboard.press('End');
  await expect(links.last()).toBeFocused();
  await expect(links.last()).toBeInViewport({ ratio: 1 });
  await expect(links.last().locator('img')).toHaveCSS('object-position','40% 30%');
  await page.keyboard.press('Home');
  await expect(links.first()).toBeFocused();
  expect(await track.evaluate(el=>el.scrollTop)).toBeLessThan(8);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/hisui-kirasagi-hero-*.webp', async route => { await gate; await route.fallback(); });
  const request = page.waitForRequest('**/hisui-kirasagi-hero-*.webp');
  await links.nth(1).click();
  await request;
  await links.nth(2).click();
  await expect(page).toHaveURL(/fixture-2$/);
  await expect(page.locator('.character-caption h3')).toHaveText('Study 2');
  release();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Português (BR)' }).click();
  await expect(page.locator('.character-rank')).toHaveText('Exemplo');
  await expect(page).toHaveURL(/\/exhibit\/\?lang=pt-br#\/characters\/fixture-2$/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(2400);
  await expect(page.locator('.affiliation-insignia, .archival-insignia')).toHaveCount(0);
  await page.goto('/exhibit/?lang=pt-br#/characters/fixture-3');
  const primary = page.locator('.examination-nav .affiliation-insignia');
  await expect(primary).toContainText('Membro');
  await expect(primary.locator('img')).toHaveAttribute('src', /\/exhibit\/media\/house-wonderwall-quill/);
  await primary.locator('img').evaluate((img: HTMLImageElement) => img.decode());
  await expect(page.getByRole('tabpanel')).not.toContainText('Example company');
  await expect(page.getByRole('tabpanel')).not.toContainText('Example order');
  await expect(page.locator('.affiliation-insignia:visible')).toHaveCount(1);
  await expect(page.locator('.archival-insignia')).toContainText('AfiliaçãoDivinação');
  const symbol = page.locator('.archival-insignia img');
  await symbol.evaluate((img: HTMLImageElement) => img.decode());
  await page.setViewportSize({width:320, height:568});
  await page.getByRole('tab', {name:'Biografia'}).click();
  const reading = page.getByRole('tabpanel');
  const scrollPosition = () => reading.evaluate(el => (el.closest('.character-caption[data-scroll-all]') ?? el).scrollTop);
  await expect(reading).toHaveAccessibleName('Biografia');
  // Let the section's next-frame scroll reset finish before sending the keyboard jump.
  await reading.evaluate(() => new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  await reading.press('End');
  await expect.poll(scrollPosition).toBeGreaterThan(0);
  await page.getByRole('tab', {name:'Relações'}).click();
  await expect(reading.getByRole('link', {name:/Study 2/})).toHaveAttribute('href', '#/characters/fixture-2');
  await expect.poll(scrollPosition).toBe(0);
  expect(await reading.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.getByRole('button', {name:'Registro de indivíduos'}).click();
  const selected = links.nth(3);
  await expect(selected).toBeFocused();
  await expect(selected).toBeInViewport({ ratio: 1 });
  await expect(selected).toHaveAttribute('aria-current', 'true');
  await expect(selected).toHaveAccessibleDescription('Exemplo');
  await expect(selected.getByText('Exemplo', {exact:true})).toBeHidden();
  const caption = selected.locator('.registry-caption');
  expect(await caption.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0);
  const bounds = (await caption.boundingBox())!;
  const name = (await selected.locator('.registry-name').boundingBox())!;
  expect(name.x + name.width / 2).toBeCloseTo(bounds.x + bounds.width / 2, 1);
  expect(name.y).toBeGreaterThan(bounds.y);
  expect(name.y + name.height).toBeLessThan(bounds.y + bounds.height);
});
