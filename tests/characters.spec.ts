import { test, expect } from './browser';
import { readdir } from 'node:fs/promises';

const review = 'test-results/react-review/';
test('examination and glass discovery hand off to the decoded hero in the same environment', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#archive-index');
  const art = page.locator('.character-exhibit .scene-art');
  const original = await art.elementHandle();
  await page.getByRole('link',{name:'Open Characters'}).click();
  await expect(page.getByRole('tabpanel')).toContainText('169 cm');
  expect(await art.evaluate((el, previous) => el === previous, original)).toBe(true);
  await page.getByRole('tab',{name:'Biography'}).click();
  const trigger = page.getByRole('button',{name:'Registry of Individuals'});
  await page.screenshot({path:review+'examination.png'});
  const box = await art.boundingBox();
  await trigger.click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Registry of Individuals');
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Scroll left|Scroll right/ })).toHaveCount(0);
  const portraits = page.locator('.registry-portrait');
  const collection = await readdir('src/content/characters', { withFileTypes: true });
  await expect(portraits).toHaveCount(collection.filter(entry => entry.isDirectory()).length);
  const hisuiPortrait = page.getByRole('link', { name: 'Hisui Kirasagi', exact: true });
  await expect(portraits.first()).toBeFocused();
  await expect(page.locator('.registry-frame img').first()).toHaveCSS('object-position','50% 50%');
  await expect(page.locator('.registry-panel')).toHaveCSS('transform','none');
  await expect(page.locator('.registry-smoke')).toHaveCSS('backdrop-filter', 'blur(8px)');
  for (const card of await portraits.all()) {
    const rect = (await card.boundingBox())!;
    const image = (await card.locator('img').boundingBox())!;
    const caption = (await card.locator('.registry-caption').boundingBox())!;
    expect(image.width / image.height).toBeCloseTo(2/3, 2);
    expect(image.width).toBeCloseTo(rect.width - 6, 1);
    expect(caption.width).toBeCloseTo(image.width, 1);
    expect(caption.y).toBeCloseTo(image.y + image.height, 1);
    expect(caption.y + caption.height).toBeCloseTo(rect.y + rect.height - 1, 1);
  }
  const track = page.locator('.registry-track');
  expect(await track.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0);
  await expect(portraits.nth(6)).toBeInViewport();
  expect(await art.boundingBox()).toEqual(box);
  await page.keyboard.press('ArrowRight');
  await expect(hisuiPortrait).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(portraits.nth(7)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(hisuiPortrait).toBeFocused();
  await page.screenshot({path:review+'registry-focused.png'});
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('tab',{name:'Biography'})).toHaveAttribute('aria-selected','true');
  await page.goForward();
  await expect(portraits.first()).toBeFocused();
  await portraits.first().click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await hisuiPortrait.hover();
  const lift = 'matrix(1.018, 0, 0, 1.018, 0, -5)';
  await expect(hisuiPortrait.locator('.registry-card')).toHaveCSS('transform', lift);
  await hisuiPortrait.click();
  const dialog = page.locator('dialog');
  await expect(dialog.locator('.registry-panel')).toHaveAttribute('inert', '');
  await expect(page.locator('.character-caption h3')).toHaveText('Hisui Kirasagi');
  await expect(dialog.locator('.registry-glass')).toHaveCSS('clip-path', /^polygon\(/);
  await expect(portraits.nth(1).locator('.registry-card')).toHaveCSS('transform', lift);
  await expect(portraits.nth(1).locator('.registry-name')).toHaveCSS('background-size', '0% 100%, 100% 100%');
  await page.screenshot({path:review+'registry-reveal.png'});
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/hisui-kirasagi$/);
  await expect(page.getByRole('tabpanel')).toContainText('Tsukimiya');
  await page.screenshot({path:review+'hisui-overview.png'});
  await page.goBack();
  await expect(page.getByRole('tab',{name:'Biography'})).toHaveAttribute('aria-selected','true');
  await page.keyboard.press('Tab');
  await page.getByRole('tab',{name:'Biography'}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText('Deception');
  await page.reload();
  await expect(page.getByRole('tab',{name:'Abilities'})).toHaveAttribute('aria-selected','true');
  await page.getByRole('link',{name:'Grand Index'}).click();
  await expect(page.locator('#archive-index')).toBeInViewport({ratio:.99});
});

test.describe('touch browsing', () => {
  test.use({hasTouch:true, viewport:{width:360,height:640}, reducedMotion:'reduce'});
  test('Portuguese discovery scrolls internally and keeps a cancelled section',async ({page})=>{
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.goto('/?lang=pt-br#/characters/lenore-engelmeyer/relations');
    const trigger=page.getByRole('button',{name:'Registro de indivíduos'});
    await expect(trigger.locator('.registry-threshold-mark > span')).toHaveCSS('opacity', '1');
    await expect.poll(() => trigger.locator('i').evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
    await trigger.tap({position:{x:10,y:20}});
    await expect(page.getByRole('dialog')).toHaveAccessibleName('Registro de indivíduos');
    const track=page.locator('.registry-track');
    await page.screenshot({path:review+'registry-phone.png'});
    await expect(page.locator('.registry-panel')).toHaveCSS('transform','none');
    await page.getByRole('button',{name:'Voltar ao registro'}).tap();
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('tab',{name:'Relações'})).toHaveAttribute('aria-selected','true');
    await trigger.tap();
    await page.getByRole('link',{name:'Hisui Kirasagi'}).tap();
    await expect(page.getByRole('tab',{name:'Visão geral'})).toHaveAttribute('aria-selected','true');
    await expect(page.getByRole('tabpanel')).toContainText('1557');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(360);
    await page.setViewportSize({width:320,height:568});
    await page.getByRole('tab',{name:'Habilidades'}).tap();
    await expect(page.getByRole('tabpanel')).toContainText('Abyssal Flower');
    const panel=page.getByRole('tabpanel');
    await panel.evaluate(el=>el.scrollTo({top:el.scrollHeight,behavior:'instant'}));
    await expect.poll(()=>panel.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
    await trigger.tap();
    await expect(page.getByRole('link',{name:'Hisui Kirasagi'})).toBeFocused();
    const before = await track.evaluate(el=>el.scrollTop);
    const cdp=await page.context().newCDPSession(page);
    const rect=(await track.boundingBox())!;
    const x=rect.x+rect.width/2;
    const bottom=rect.y+rect.height;
    for (const [type,y] of [['touchStart',bottom-80],['touchMove',bottom-155],['touchMove',bottom-250],['touchEnd',0]] as const) {
      await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
    }
    await expect.poll(()=>track.evaluate(el=>el.scrollTop)).toBeGreaterThan(before+30);
    expect(await page.evaluate(()=>scrollY)).toBe(0);
  });
});

test('the examination threshold is visible at rest and responds across its activation territory', async ({page}) => {
  for (const [id, width] of [['lenore-engelmeyer', 1440], ['hisui-kirasagi', 2560], ['hisui-kirasagi', 820]] as const) {
    await page.setViewportSize({width,height:900});
    await page.goto('/?lang=en#/characters/' + id);
    const trigger = page.getByRole('button',{name:'Registry of Individuals'});
    const mark = trigger.locator('.registry-threshold-mark');
    await page.mouse.click(width - 10, 80);
    await expect(mark.getByText('Registry of Individuals')).toHaveCSS('opacity','1');
    await expect(mark.locator('i')).toBeVisible();
    await expect.poll(() => mark.locator('i').evaluate(el => getComputedStyle(el, '::after').animationDuration)).toBe('5.2s');
    const bounds = (await trigger.boundingBox())!;
    expect(bounds.x + bounds.width / 2).toBeCloseTo(width / 2);
    expect(bounds.width).toBeGreaterThanOrEqual(280);
    expect(bounds.height).toBeGreaterThanOrEqual(65);
    const reading = (await page.getByRole('tabpanel').boundingBox())!;
    expect(reading.y + reading.height).toBeLessThanOrEqual(bounds.y);
    const optical = () => trigger.evaluate(el => Number(getComputedStyle(el, '::after').opacity));
    await expect.poll(optical).toBe(.45);
    for (const offset of [10, bounds.width - 10]) {
      await page.mouse.move(bounds.x + offset, bounds.y + 15);
      await expect.poll(optical).toBe(.8);
      await expect(trigger).toHaveCSS('cursor', 'pointer');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.mouse.click(bounds.x + offset, bounds.y + 15);
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await page.mouse.click(width - 10, 80);
    }
    await page.keyboard.press('Tab');
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveCSS('outline-style','solid');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test('Back and resize during the handoff restore the originating record and release the dialog', async ({page}) => {
  await page.goto('/#/characters/lenore-engelmeyer/relations');
  await page.locator('.registry-trigger').click();
  await page.getByRole('link',{name:'Hisui Kirasagi'}).click();
  await expect(page.locator('.registry-glass')).toHaveCSS('clip-path', /^polygon\(/);
  await page.setViewportSize({width:780,height:540});
  await page.goBack();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page).toHaveTitle('Le’nore Voren Engelmeyer · SiNE Archives');
  await expect(page.getByRole('tab',{name:'Relations'})).toHaveAttribute('aria-selected','true');
  await expect(page.locator('.character-exhibit .scene-art')).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveTitle('Hisui Kirasagi · SiNE Archives');
});

test('the portrait reveal starts at the visible part of a scrolled phone card', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 });
  let release!: () => void;
  const delay = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/media/vaey-viktor-hero-*.webp', async route => { await delay; await route.fallback(); });
  await page.goto('/#/characters/lenore-engelmeyer');
  await page.locator('.registry-trigger').click();
  const track = page.locator('.registry-track');
  const vaey = page.getByRole('link', { name: 'Vaey Viktor' });
  await track.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await vaey.click();
  await expect(page.getByRole('dialog').getByRole('status')).toContainText('Opening Vaey Viktor');
  await track.evaluate(el => { el.scrollTop -= 130; });
  const frame = (await vaey.locator('.registry-frame').boundingBox())!;
  const view = (await track.boundingBox())!;
  expect(frame.y + frame.height).toBeGreaterThan(view.y + view.height);
  const origin = { x: (frame.x + frame.width / 2) / 390 * 100, y: (frame.y + view.y + view.height) / 2 / 640 * 100 };
  const observed = page.evaluate(() => {
    const glass = document.querySelector('.registry-glass')!;
    const smoke = document.querySelector('.registry-smoke')!;
    return new Promise<number[][]>(resolve => {
      function observe() {
        const paths = [glass, smoke].map(el => getComputedStyle(el).clipPath);
        if (paths.every(path => path.startsWith('polygon('))) {
          resolve(paths.map(path => {
            const corners = path.split(',').slice(5, 9).map(point => point.trim().split(' ').map(parseFloat));
            return [0, 1].map(axis => corners.reduce((sum, corner) => sum + corner[axis], 0) / corners.length);
          }));
        } else if (glass.isConnected) {
          requestAnimationFrame(observe);
        } else {
          resolve([]);
        }
      }
      observe();
    });
  });
  release();
  const centers = await observed;
  expect(centers).toHaveLength(2);
  for (const [x, y] of centers) {
    expect(Math.abs(x - origin.x)).toBeLessThan(1);
    expect(Math.abs(y - origin.y)).toBeLessThan(1);
  }
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.character-caption h3')).toHaveText('Vaey Viktor');
});

test('the persistent return and current, hover and focus states remain distinct', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#/characters/lenore-engelmeyer/relations');
  await page.locator('.registry-trigger').click();
  const portraits = page.locator('.registry-portrait');
  const threshold = page.getByRole('button',{name:'Return to record'});
  await expect(page.locator('.registry-panel')).toHaveCSS('transform', 'none');
  const bounds = (await threshold.boundingBox())!;
  expect(bounds.x + bounds.width/2).toBeCloseTo(720);
  await expect(threshold.locator('span')).toHaveCSS('opacity','1');
  const second = portraits.nth(1);
  const surface = second.locator('.registry-card');
  const original = await second.boundingBox();
  const neighbor = await portraits.nth(2).boundingBox();
  const name = second.locator('.registry-name');
  await expect(name).toHaveCSS('color','rgb(248, 247, 244)');
  await expect(second.locator('.registry-caption')).toHaveCSS('text-align','center');
  await second.hover();
  await expect(name).toHaveCSS('background-size', '0% 100%, 100% 100%');
  await expect.poll(() => second.locator('.registry-frame').evaluate(el => getComputedStyle(el, '::after').clipPath)).toBe('inset(0px 0% 0px 0px)');
  await expect(name).toHaveCSS('color','rgb(248, 247, 244)');
  await expect(surface).toHaveCSS('transform','matrix(1.018, 0, 0, 1.018, 0, -5)');
  const lifted = (await surface.boundingBox())!;
  expect(lifted.y).toBeLessThan(original!.y - 4);
  expect(lifted.width).toBeGreaterThan(original!.width);
  expect(await second.boundingBox()).toEqual(original);
  expect(await portraits.nth(2).boundingBox()).toEqual(neighbor);
  await page.screenshot({path:review + 'registry-hover.png'});
  await expect(portraits.first()).toHaveAttribute('aria-current','true');
  await expect(second).not.toHaveAttribute('aria-current','true');
  await page.keyboard.press('End');
  await expect(portraits.last()).toBeFocused();
  await expect(portraits.last()).toHaveCSS('outline-color','rgb(189, 238, 240)');
  await expect(portraits.last().locator('.registry-name')).toHaveCSS('color','rgb(248, 247, 244)');
  await expect(threshold).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Tab');
  await expect(threshold).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('.registry-trigger')).toBeFocused();
  await expect(page).toHaveURL(/relations$/);

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.registry-trigger').click();
  await second.hover();
  await expect(name).toHaveCSS('color','rgb(248, 247, 244)');
  await expect(surface).toHaveCSS('transform','none');
});

test('the published grid maintains its density, legibility and contained scroll across viewports', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const { width, height, columns, subject, locale } of [
    { width:1920, height:1080, columns:6, subject:'lenore-engelmeyer', locale:'en' },
    { width:1440, height:900, columns:6, subject:'hisui-kirasagi', locale:'en' },
    { width:1280, height:800, columns:6, subject:'alithia-wonderwall', locale:'en' },
    { width:1024, height:600, columns:5, subject:'ayanna-aedh-aibhilyn', locale:'en' },
    { width:820, height:900, columns:4, subject:'eclesia-wonderwall', locale:'pt-br' },
    { width:390, height:844, columns:2, subject:'lenore-engelmeyer', locale:'pt-br' },
    { width:740, height:360, columns:4, subject:'vaey-viktor', locale:'en' },
  ]) {
    await page.setViewportSize({width,height});
    await page.goto('about:blank');
    await page.goto('/?lang=' + locale + '#/characters/' + subject);
    await page.locator('.character-exhibit .scene-art').evaluate((image: HTMLImageElement) => image.decode());
    await page.locator('.registry-trigger').click();
    const track = page.locator('.registry-track');
    const selected = track.locator('[aria-current=true]');
    await expect(selected).toBeFocused();
    await expect(selected).toBeInViewport({ratio:.65});
    const layout = await track.evaluate(el => {
      const cards = Array.from(el.querySelectorAll('li'));
      const firstRow = cards.filter(card => card.offsetTop === cards[0].offsetTop);
      return { columns:firstRow.length, overflow:el.scrollWidth - el.clientWidth,
        rowTwoBottom:cards[firstRow.length].getBoundingClientRect().bottom, bottom:el.getBoundingClientRect().bottom };
    });
    expect(layout.columns).toBe(columns);
    expect(layout.overflow).toBe(0);
    if (width >= 1280) expect(layout.rowTwoBottom).toBeLessThan(layout.bottom);
    await track.evaluate(async el => {
      const view = el.getBoundingClientRect();
      await document.fonts.ready;
      await Promise.all(Array.from(el.querySelectorAll('img'))
        .filter(image => image.getBoundingClientRect().top < view.bottom && image.getBoundingClientRect().bottom > view.top)
        .map(image => image.decode()));
    });
    await page.screenshot({path:review + 'registry-' + width + 'x' + height + '.png'});
  }
});

test('quick dismissal and history reversal keep one modal and the original examination section', async ({page}) => {
  await page.goto('/#/characters/lenore-engelmeyer/relations');
  const trigger = page.locator('.registry-trigger');
  await trigger.click();
  await page.getByRole('button', {name:'Return to record'}).evaluate(button => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.locator('.registry-panel')).toHaveAttribute('inert', '');
  await page.goForward();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(page.locator('.registry-panel')).not.toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('tab', {name:'Relations'})).toHaveAttribute('aria-selected','true');
});
