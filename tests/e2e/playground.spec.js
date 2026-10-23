// @ts-check
import {test, expect} from './fixtures';

/** @param {import('@playwright/test').Page} page */
async function editorText(page) {
  return (await page.locator('.cm-content').innerText()).trim();
}

/** @param {import('@playwright/test').Page} page */
async function openPlayground(page) {
  await page.goto('/');
  const fmt = page.locator('#fmt');
  await expect(fmt).toHaveText('sqlfmt!');
  await expect(fmt).toBeEnabled();
  expect(await page.evaluate(() => /** @type {any} */ (window).__micropipInstalled)).toBe('shandy-sqlfmt[jinjafmt]');
  return fmt;
}

test('formats the editor contents', async ({page, pageErrors}) => {
  const fmt = await openPlayground(page);
  expect(await editorText(page)).toBe('select 1');

  await page.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('SELECT A, B FROM T');
  await expect.poll(() => editorText(page)).toBe('SELECT A, B FROM T');

  await fmt.click();
  await expect(page.getByRole('alert').filter({hasText: 'Formatted!'})).toBeVisible();
  await expect.poll(() => editorText(page)).toContain('select a, b from t');
  const calls = await page.evaluate(() => /** @type {any} */ (window).__pyodideCalls);
  expect(calls.at(-1)).toEqual({code: 'SELECT A, B FROM T', line_length: 88, no_jinjafmt: false});

  await fmt.click();
  await expect(page.getByRole('alert').filter({hasText: 'Code already formatted.'})).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('passes line length and jinja options to sqlfmt', async ({page}) => {
  const fmt = await openPlayground(page);
  const slider = page.locator('#lineLengthSlider');
  await slider.fill('100');
  await expect(page.locator('output')).toHaveText('100');
  await page.locator('#jinjaCheckbox').uncheck();
  await fmt.click();
  await expect(page.getByRole('alert').filter({hasText: 'Formatted!'})).toBeVisible();
  const calls = await page.evaluate(() => /** @type {any} */ (window).__pyodideCalls);
  expect(calls.at(-1)).toMatchObject({line_length: '100', no_jinjafmt: true});
});

test('shows an error toast on a syntax error', async ({page}) => {
  const fmt = await openPlayground(page);
  await page.locator('.cm-content').click();
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.type('select SYNTAX_ERROR');
  await fmt.click();
  await expect(page.getByRole('alert').filter({hasText: 'A syntax error prevented your'})).toBeVisible();
  expect(await editorText(page)).toBe('select SYNTAX_ERROR');
});

test('example and clear buttons replace the editor contents', async ({page}) => {
  await openPlayground(page);
  await page.getByRole('button', {name: 'Load unformatted example'}).click();
  await expect.poll(() => editorText(page)).toContain('dbt_utils.get_column_values');
  await page.getByRole('button', {name: 'Clear Editor'}).click();
  await expect.poll(() => editorText(page)).toBe('');
});

test('copy button copies the editor contents', async ({page, context, baseURL}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {origin: baseURL});
  await openPlayground(page);
  const copyButton = page.locator('#copyButton');
  await copyButton.click();
  await expect(copyButton.locator('img')).toHaveAttribute('src', '/img/icons8-check-50.png');
  await expect(page.getByRole('alert').filter({hasText: 'Editor contents copied to clipboard.'})).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('select 1');
  await expect(copyButton.locator('img')).toHaveAttribute('src', '/img/icons8-clipboard-48.png');
});

test('theme toggle switches the site and editor to dark mode', async ({page, pageErrors}) => {
  await openPlayground(page);
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  const editorBackground = () => page.locator('.cm-editor').evaluate((el) => getComputedStyle(el).backgroundColor);
  const lightBackground = await editorBackground();

  const toggle = page.getByRole('button', {name: /Switch between dark and light mode/});
  for (let i = 0; i < 3 && (await html.getAttribute('data-theme')) !== 'dark'; i++) {
    await toggle.click();
  }
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect.poll(editorBackground).not.toBe(lightBackground);
  expect(pageErrors).toEqual([]);
});
