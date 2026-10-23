// @ts-check
import {test, expect} from './fixtures';

// Each docs page and the H1 it should render.
const DOC_PAGES = [
  ['/docs/intro', 'Introduction to sqlfmt'],
  ['/docs/getting-started/installation', 'Installation'],
  ['/docs/getting-started/using-sqlfmt', 'Using sqlfmt'],
  ['/docs/getting-started/configuring-sqlfmt', 'Configuring sqlfmt'],
  ['/docs/getting-started/disabling-sqlfmt', 'Disabling sqlfmt'],
  ['/docs/getting-started/formatting-jinja', 'Formatting Jinja'],
  ['/docs/getting-started/file-encoding', 'About File Encodings'],
  ['/docs/getting-started/git-blame', 'Improving Git Blame'],
  ['/docs/getting-started/using-container', 'Using sqlfmt in a Container'],
  ['/docs/integrations/dbt', 'dbt (Core)'],
  ['/docs/integrations/dbt-cloud', 'dbt Cloud'],
  ['/docs/integrations/dbt-power-user', 'dbt Power User (VS Code Extension)'],
  ['/docs/integrations/docker', 'Docker'],
  ['/docs/integrations/github-actions', 'GitHub Actions'],
  ['/docs/integrations/pre-commit', 'pre-commit'],
  ['/docs/integrations/sqlfluff', 'SQLFluff'],
  ['/docs/integrations/trunk', 'Trunk'],
  ['/docs/integrations/vs-code', 'VS Code'],
  ['/docs/style/', 'The sqlfmt style'],
  ['/docs/dialects/', 'Using sqlfmt with Different SQL Dialects'],
  ['/docs/api/', 'API Reference'],
  ['/docs/versioning/', 'Maturity and Stability'],
  ['/docs/privacy/', 'Privacy Policy'],
  ['/docs/category/getting-started', 'Getting Started'],
  ['/docs/category/integrations', 'Integrations'],
];

test('home page renders hero, features and playground', async ({page, pageErrors}) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/sqlfmt/);
  await expect(page.getByRole('heading', {level: 1, name: 'sqlfmt'})).toBeVisible();
  await expect(page.getByText("sqlfmt formats your dbt SQL files so you don't have to.").first()).toBeVisible();
  for (const feature of ['Easy to Use', 'Promotes Collaboration', 'Fast and Lightweight']) {
    await expect(page.getByRole('heading', {name: feature})).toBeVisible();
  }
  await expect(page.getByRole('heading', {name: 'Try it here'})).toBeVisible();
  await expect(page.locator('.cm-editor')).toBeVisible();
  await expect(page.locator('#fmt')).toHaveText('sqlfmt!');
  expect(pageErrors).toEqual([]);
});

for (const [path, heading] of DOC_PAGES) {
  test(`docs page ${path}`, async ({page, pageErrors}) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', {level: 1})).toHaveText(heading);
    await expect(page.getByRole('navigation', {name: 'Docs sidebar'})).toBeVisible();
    // Images in the article must actually load.
    for (const img of await page.locator('article img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => /** @type {HTMLImageElement} */ (el).naturalWidth)).toBeGreaterThan(0);
    }
    expect(pageErrors).toEqual([]);
  });
}

test('unknown routes serve the 404 page', async ({page}) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Page Not Found');
});

test('sitemap lists every docs page', async ({request}) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('<urlset');
  expect(body).toContain('<loc>https://sqlfmt.com/</loc>');
  for (const [path] of DOC_PAGES) {
    expect(body).toContain(`<loc>https://sqlfmt.com${path}</loc>`);
  }
});

test('static assets resolve', async ({request}) => {
  for (const asset of ['/img/favicon.ico', '/img/logo.png', '/img/icons8-clipboard-48.png', '/img/icons8-check-50.png']) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    expect((await response.body()).length, asset).toBeGreaterThan(0);
  }
});
