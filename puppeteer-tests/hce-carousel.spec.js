const puppeteer = require('puppeteer');
const {HelperI, launch, timeout, baseUrl} = require('./helper-i');
jest.setTimeout(timeout);

describe('hce-carousel', () => {
  let browser;
  let page;
  const errors = [];
  let I;

  beforeAll(async done => {
    browser = await puppeteer.launch(launch);
    page = (await browser.pages())[0];
    page.on('pageerror', err => errors.push(err));
    page.on('error', err => errors.push(err));

    I = new HelperI(page);
    await page.goto(baseUrl + '/#carousel', {waitUntil: 'networkidle2'});
    done();
  });

  it('hce-carousel prev button', async done => {
    await page.waitFor('li[tabindex] img.img4', '#x1');
    await I.click('.prev button', '#x1');
    await page.waitFor('li[tabindex] img.img3', '#x1');
    await I.click('.prev button', '#x1');
    await page.waitFor('li[tabindex] img.img2', '#x1');
    await I.click('.prev button', '#x1');
    await page.waitFor('li[tabindex] img.img1', '#x1');
    done();
  });

  it('hce-carousel next button', async done => {
    await I.click('li:nth-child(1)', '#x1');
    await page.waitFor('li[tabindex] img.img1', '#x1');
    await I.click('.next button', '#x1');
    await page.waitFor('li[tabindex] img.img2', '#x1');
    await I.click('.next button', '#x1');
    await page.waitFor('li[tabindex] img.img3', '#x1');
    done();
  });

  it('hce-carousel index buttons', async done => {
    await I.click('.shortcuts li:nth-child(1)', '#x1');
    await page.waitFor('li[tabindex] img.img1', '#x1');
    await I.click('.shortcuts li:nth-child(2)', '#x1');
    await page.waitFor('li[tabindex] img.img2', '#x1');
    await I.click('.shortcuts li:nth-child(9)', '#x1');
    await page.waitFor('li[tabindex] img.img9', '#x1');
    done();
  });

  afterAll(async () => {
    expect(errors.length).toBe(0);
    browser.close();
  });
});
