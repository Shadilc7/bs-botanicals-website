import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [ ['/', /Rooted in Zambia/], ['/about', /Zambian Origins/], ['/gemstones', /From Zambia’s Earth/], ['/botanicals', /Naturally Zambian/], ['/womens-wellness', /Women’s Wellness/], ['/contact', /Let’s Connect/], ['/privacy', /Privacy Notice/] ];

test('all pages load with one heading, working assets, unique titles and no horizontal overflow', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const titles = new Set();
  for (const [path, heading] of pages) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(heading);
    titles.add(await page.title());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    }
  }
  expect(titles.size).toBe(pages.length);
  expect(errors).toEqual([]);
});

test('navigation opens, closes and changes pages', async ({ page }, info) => {
  await page.goto('/');
  if (info.project.name === 'mobile') {
    const toggle = page.locator('.menu-button');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
  }
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Gemstones', exact: true }).click();
  await expect(page).toHaveURL(/\/gemstones$/);
  await expect(page.locator('#main-navigation a[href="/gemstones"]')).toHaveAttribute('aria-current', 'page');
  if (info.project.name === 'mobile') await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
});

test('product enquiry links preselect their category and product', async ({ page }) => {
  await page.goto('/gemstones');
  await page.getByRole('link', { name: 'Discuss sourcing' }).first().click();
  await expect(page.getByLabel('I am interested in')).toHaveValue('Rough gemstones');
  await page.getByText('Additional details', { exact: false }).click();
  await expect(page.getByLabel('Product / variety / ingredient')).toHaveValue('Emerald');
  await page.goto('/botanicals');
  await page.getByRole('link', { name: 'Enquire about Baobab', exact: true }).click();
  await expect(page.getByLabel('I am interested in')).toHaveValue('Botanicals & superfoods');
  await page.goto('/womens-wellness');
  await page.getByRole('link', { name: 'Enquire About the Collection' }).click();
  await expect(page.getByLabel('I am interested in')).toHaveValue('Women’s teas');
});

test('four required fields create an editable email draft without transmitting personal information', async ({ page }) => {
  const submissions = []; page.on('request', request => { if (request.method() === 'POST') submissions.push(request.url()); });
  await page.goto('/contact?category=gemstones');
  await expect(page.getByRole('button', { name: 'Prepare Email Enquiry' })).toBeVisible();
  expect(await page.locator('form [required]').count()).toBe(4);
  await page.getByRole('button', { name: 'Prepare Email Enquiry' }).click();
  await expect(page.getByLabel('Full name')).toBeVisible();
  await page.getByLabel('Full name').fill('Test Buyer');
  await page.getByLabel('Email address').fill('buyer@example.com');
  await page.getByLabel('Your message').fill('Please discuss a rough gemstone sample parcel.');
  await page.getByRole('button', { name: 'Prepare Email Enquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Your Enquiry Draft Is Ready.' })).toBeVisible();
  await expect(page.getByText('Your enquiry has not been sent yet.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Email App' })).toHaveAttribute('href', /mailto:info@bs-botanicals.com\?subject=/);
  await page.getByRole('button', { name: 'Edit your enquiry' }).click();
  await expect(page.getByLabel('Full name')).toHaveValue('Test Buyer');
  await expect(page.getByLabel('Your message')).toHaveValue('Please discuss a rough gemstone sample parcel.');
  expect(submissions).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
});

test('FAQ accordion exposes answers and toggles closed', async ({ page }) => {
  await page.goto('/');
  const question = page.getByRole('button', { name: 'How does a sourcing enquiry work?' });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Tell us the gemstone or botanical ingredient, preferred form or specifications', { exact: false })).toBeVisible();
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'false');
});

test('configured direct delivery shows confirmation only after a successful response', async ({ page }) => {
  await page.route('**/api/config', route => route.fulfill({ json: { deliveryAvailable: true, privacyNotice: 'Reviewed notice test fixture.' } }));
  let submitted;
  await page.route('**/api/enquiry', async route => { submitted = route.request().postDataJSON(); await route.fulfill({ json: { success: true } }); });
  await page.goto('/contact?category=botanicals');
  await page.getByLabel('Full name').fill('Test Buyer');
  await page.getByLabel('Email address').fill('buyer@example.com');
  await page.getByLabel('Your message').fill('Please discuss dried hibiscus sourcing.');
  await page.getByRole('button', { name: 'Send Enquiry', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Thank You for Getting in Touch.' })).toBeVisible();
  expect(submitted.interest).toBe('Botanicals & superfoods');
  expect(submitted.message).toBe('Please discuss dried hibiscus sourcing.');
});

test('failed direct delivery preserves the enquiry and never claims it was received', async ({ page }) => {
  await page.route('**/api/config', route => route.fulfill({ json: { deliveryAvailable: true, privacyNotice: 'Reviewed notice test fixture.' } }));
  await page.route('**/api/enquiry', route => route.fulfill({ status: 502, json: { error: 'Provider unavailable' } }));
  await page.goto('/contact?category=gemstones');
  await page.getByLabel('Full name').fill('Test Buyer');
  await page.getByLabel('Email address').fill('buyer@example.com');
  await page.getByLabel('Your message').fill('Please discuss a rough emerald parcel.');
  await page.getByRole('button', { name: 'Send Enquiry', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('We couldn’t send your enquiry.');
  await expect(page.getByLabel('Your message')).toHaveValue('Please discuss a rough emerald parcel.');
  await expect(page.getByRole('heading', { name: 'Thank You for Getting in Touch.' })).toHaveCount(0);
});

test('wellness concepts have development labels and no checkout', async ({ page }) => {
  await page.goto('/womens-wellness');
  await expect(page.locator('.concept-card')).toHaveCount(5);
  await expect(page.locator('.development-tag')).toHaveCount(5);
  await expect(page.getByText('not yet available for purchase', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: /buy|add to cart|checkout/i })).toHaveCount(0);
});

test('unknown paths offer recovery', async ({ page }) => {
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: 'We Couldn’t Find That Page' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('/');
});

test('core pages pass automated WCAG accessibility checks', async ({ page }) => {
  for (const path of ['/', '/contact', '/womens-wellness']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, issue: n.failureSummary })) })) ).toEqual([]);
  }
});
