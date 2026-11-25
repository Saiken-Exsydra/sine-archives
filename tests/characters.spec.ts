import { test, expect } from './browser';

test('entry keeps the artwork mounted and the reading region grows independently of the rail', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#archive-index');
  const art = page.locator('.character-exhibit .scene-art');
  const original = await art.elementHandle();
  await page.getByRole('link',{name:'Open Characters'}).click();
  const rail = page.locator('.individual-rail');
  const reading = page.getByRole('tabpanel');
  await expect(rail).toHaveAttribute('data-open','true');
  await expect(page.getByRole('tab',{name:'Overview'})).toHaveAttribute('aria-selected','true');
  await expect(reading).toContainText('169 cm');
  const box = await art.boundingBox();
  expect(await art.evaluate((el, previous) => el === previous, original)).toBe(true);
  await page.screenshot({path:'test-results/react-review/characters-overview.png',animations:'disabled'});
  const bottom = () => reading.evaluate(el=>el.getBoundingClientRect().bottom);
  const overviewBottom = await bottom();
  await page.getByRole('tab',{name:'Biography'}).click();
  await expect(rail).toHaveAttribute('data-open','false');
  await expect.poll(bottom).toBeGreaterThan(overviewBottom+40);
  await page.getByRole('button',{name:'Browse individuals'}).hover();
  await expect(rail).toHaveAttribute('data-open','true');
  expect(await art.boundingBox()).toEqual(box);
  await page.getByRole('link',{name:'Hisui Kirasagi'}).click();
  await expect(reading).toContainText('Tsukimiya');
  await expect(page).toHaveURL(/hisui-kirasagi\/biography$/);
  await page.getByRole('tab',{name:'Biography'}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(reading).toContainText('Abyssal Flower');
  await page.reload();
  await expect(page.getByRole('heading',{name:'Hisui Kirasagi'})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('tab',{name:'Biography'})).toHaveAttribute('aria-selected','true');
  await page.getByRole('tab',{name:'Overview'}).click();
  await expect(rail).toHaveAttribute('data-open','true');
  await page.getByRole('link',{name:'Grand Index'}).click();
  await expect(page.locator('#archive-index')).toBeInViewport({ratio:.99});
});

test('small screen supports explicit rail control and reading scroll',async ({page})=>{
  await page.setViewportSize({width:360,height:640});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/?lang=pt-br#/characters/hisui-kirasagi/relations');
  const handle=page.getByRole('button',{name:'Explorar personagens'});
  await handle.focus();
  await page.keyboard.press('Enter');
  await expect(handle).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:"Le’nore Voren Engelmeyer"})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(handle).toBeFocused();
  await expect(handle).toHaveAttribute('aria-expanded','false');
  await page.getByRole('tab',{name:'Visão geral'}).click();
  await expect(page.getByRole('tabpanel')).toContainText('1557');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(360);
  await page.screenshot({path:'test-results/react-review/characters-phone.png',animations:'disabled'});
});


test.describe('touch browsing', () => {
  test.use({hasTouch:true, viewport:{width:320,height:568}, reducedMotion:'reduce'});
  test('tap reveals the rail, preserves the section, and releases it again',async ({page})=>{
    await page.goto('/#/characters/lenore-engelmeyer/abilities');
    const handle=page.getByRole('button',{name:'Browse individuals'});
    await handle.tap();
    await expect(handle).toHaveAttribute('aria-expanded','true');
    await page.getByRole('link',{name:'Hisui Kirasagi'}).tap();
    await expect(page.getByRole('tabpanel')).toContainText('Abyssal Flower');
    await handle.tap();
    await expect(handle).toHaveAttribute('aria-expanded','false');
    const panel=page.getByRole('tabpanel');
    await panel.evaluate(el=>el.scrollTo(0,el.scrollHeight));
    expect(await panel.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  });
});
