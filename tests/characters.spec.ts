import { test, expect } from './browser';
import { readdir } from 'node:fs/promises';

const review = 'test-results/react-review/';
test('examination, discovery and the measured hero reveal share one environment', async ({page}) => {
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
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.individual-rail')).toHaveCount(0);
  const portraits = page.locator('.registry-portrait');
  const collection = await readdir('src/content/characters', { withFileTypes: true });
  await expect(portraits).toHaveCount(collection.filter(entry => entry.isDirectory()).length);
  const hisuiPortrait = page.getByRole('link', { name: 'Hisui Kirasagi', exact: true });
  await expect(portraits.first()).toBeFocused();
  await expect(page.locator('.registry-frame img').first()).toHaveCSS('object-position','50% 50%');
  await expect(page.locator('dialog')).toHaveCSS('transform','none');
  for (const frame of await page.locator('.registry-frame').all()) {
    const rect = (await frame.boundingBox())!;
    const art = (await frame.locator('img').boundingBox())!;
    const plate = (await frame.locator('..').locator('.registry-name').boundingBox())!;
    expect(art.width / art.height).toBeCloseTo(2/3, 2);
    expect(art.width).toBeLessThan(rect.width);
    expect(plate.width).toBeCloseTo(rect.width, 1);
    expect(plate.y).toBeGreaterThan(rect.y + rect.height);
    expect(rect.width / rect.height).toBeCloseTo(2/3,3);
  }
  const trackFits = await page.locator('.registry-track').evaluate(track => track.scrollWidth <= track.clientWidth);
  if (trackFits) {
    const left = (await portraits.first().boundingBox())!;
    const right = (await portraits.last().boundingBox())!;
    expect(left.x).toBeCloseTo(1440 - right.x - right.width, 1);
  } else {
    await expect(page.getByRole('button', { name: 'Scroll right' })).toBeEnabled();
  }
  expect(await art.boundingBox()).toEqual(box);
  await page.keyboard.press('ArrowRight');
  await expect(hisuiPortrait).toBeFocused();
  await expect(page.locator('dialog')).toHaveCSS('transform','none');
  await page.screenshot({path:review+'registry-focused.png'});
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('tab',{name:'Biography'})).toHaveAttribute('aria-selected','true');
  await page.goForward();
  await expect(portraits.first()).toBeFocused();
  await portraits.first().click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await hisuiPortrait.click();
  const dialog = page.locator('dialog');
  await expect.poll(()=>dialog.evaluate(el=>getComputedStyle(el).clipPath)).toContain('polygon');
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
    await expect(page.locator('dialog')).toHaveCSS('transform','none');
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
    const before = await track.evaluate(el=>el.scrollLeft);
    expect(before).toBeGreaterThan(30);
    const cdp=await page.context().newCDPSession(page);
    const rect=(await track.boundingBox())!;
    const y=rect.y+rect.height/2;
    for (const [type,x] of [['touchStart',50],['touchMove',110],['touchMove',240],['touchEnd',0]] as const) {
      await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
    }
    await expect.poll(()=>track.evaluate(el=>el.scrollLeft)).toBeLessThan(before-30);
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

test('Back and resize during the reveal restore the originating record and release the dialog', async ({page}) => {
  await page.goto('/#/characters/lenore-engelmeyer/relations');
  await page.locator('.registry-trigger').click();
  await page.getByRole('link',{name:'Hisui Kirasagi'}).click();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('dialog')!).clipPath.startsWith('polygon'));
  await page.setViewportSize({width:780,height:540});
  await page.goBack();
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page).toHaveTitle('Le’nore Voren Engelmeyer · SiNE Archives');
  await expect(page.getByRole('tab',{name:'Relations'})).toHaveAttribute('aria-selected','true');
  await expect(page.locator('.character-exhibit .scene-art')).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveTitle('Hisui Kirasagi · SiNE Archives');
});

test('floor threshold and portrait attention follow pointer and keyboard independently of the record', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#/characters/lenore-engelmeyer/relations');
  await page.locator('.registry-trigger').click();
  const portraits = page.locator('.registry-portrait');
  const light = page.locator('.registry-wall-light');
  const threshold = page.getByRole('button',{name:'Return to record'});
  const bounds = (await threshold.boundingBox())!;
  expect(bounds.x + bounds.width/2).toBeCloseTo(720);
  await expect(threshold.locator('span')).toHaveCSS('opacity','0');
  for (const i of [1,0,1]) {
    await portraits.nth(i).locator('.registry-name').hover();
    await expect(portraits.nth(i)).toHaveAttribute('data-attended','true');
    await expect(light).toHaveAttribute('data-lit','true');
  }
  await expect(portraits.first()).toHaveAttribute('aria-current','true');
  await expect(portraits.nth(1).locator('.registry-frame')).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, -3)');
  await threshold.hover();
  await expect(light).toHaveAttribute('data-lit','false');
  await expect(threshold.locator('span')).toHaveCSS('opacity','1');
  await portraits.last().focus();
  await page.keyboard.press('Tab');
  await expect(threshold).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('.registry-trigger')).toBeFocused();
  await expect(page).toHaveURL(/relations$/);
});
