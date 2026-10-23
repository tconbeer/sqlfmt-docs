// @ts-check
import {test, expect} from './fixtures';

test('Get Started button opens the intro doc', async ({page, pageErrors}) => {
  await page.goto('/');
  await page.getByRole('link', {name: 'Get Started'}).click();
  await expect(page).toHaveURL(/\/docs\/intro$/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Introduction to sqlfmt');
  expect(pageErrors).toEqual([]);
});

test('navbar links to the docs and GitHub', async ({page}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', {name: 'Main'});
  await expect(nav.getByRole('link', {name: 'GitHub repository link'})).toHaveAttribute('href', 'https://github.com/tconbeer/sqlfmt');
  await nav.getByRole('link', {name: 'Documentation'}).click();
  await expect(page).toHaveURL(/\/docs\/intro$/);
  await nav.getByRole('link', {name: 'sqlfmt Logo'}).click();
  await expect(page).toHaveURL(/\/$/);
});

test('sidebar navigates between docs', async ({page, pageErrors}) => {
  await page.goto('/docs/intro');
  const sidebar = page.getByRole('navigation', {name: 'Docs sidebar'});
  await expect(sidebar.getByRole('link', {name: 'Introduction to sqlfmt'})).toHaveAttribute('aria-current', 'page');

  await sidebar.getByRole('link', {name: 'Getting Started', exact: true}).click();
  await expect(page).toHaveURL(/\/docs\/category\/getting-started$/);
  await sidebar.getByRole('link', {name: 'Installation'}).click();
  await expect(page).toHaveURL(/\/docs\/getting-started\/installation$/);
  await expect(page.getByRole('heading', {level: 1})).toHaveText('Installation');

  await sidebar.getByRole('link', {name: 'Integrations', exact: true}).click();
  await expect(page).toHaveURL(/\/docs\/category\/integrations$/);
  await sidebar.getByRole('link', {name: 'pre-commit'}).click();
  await expect(page.getByRole('heading', {level: 1})).toHaveText('pre-commit');

  await sidebar.getByRole('link', {name: 'The sqlfmt Style'}).click();
  await expect(page).toHaveURL(/\/docs\/style\/$/);
  expect(pageErrors).toEqual([]);
});

test('next/previous pagination works', async ({page}) => {
  await page.goto('/docs/getting-started/installation');
  const pager = page.getByRole('navigation', {name: 'Docs pages'});
  await expect(pager).toBeVisible();
  await pager.locator('a.pagination-nav__link--next').click();
  await expect(page).not.toHaveURL(/installation$/);
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await page.getByRole('navigation', {name: 'Docs pages'}).locator('a.pagination-nav__link--prev').click();
  await expect(page).toHaveURL(/installation$/);
});

test('footer links work and external ones are plain links', async ({page}) => {
  await page.goto('/');
  const footer = page.locator('footer');
  for (const [label, href] of [
    ['Installation', '/docs/getting-started/installation'],
    ['Commands', '/docs/getting-started/using-sqlfmt'],
    ['Configuration', '/docs/getting-started/configuring-sqlfmt'],
    ['Style Guide', '/docs/style'],
    ['Privacy Policy', '/docs/privacy'],
  ]) {
    await expect(footer.getByRole('link', {name: label, exact: true})).toHaveAttribute('href', href);
  }
  // The swizzled Footer/LinkItem must not add rel="noopener noreferrer" to external links.
  const pypi = footer.getByRole('link', {name: /PyPI/});
  await expect(pypi).toHaveAttribute('href', 'https://pypi.org/project/shandy-sqlfmt/');
  expect(await pypi.getAttribute('rel')).toBeNull();

  await footer.getByRole('link', {name: 'Style Guide'}).click();
  await expect(page.getByRole('heading', {level: 1})).toHaveText('The sqlfmt style');
});

test('mobile menu opens the docs sidebar', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/docs/intro');
  await page.getByRole('button', {name: 'Toggle navigation bar'}).click();
  const mobileSidebar = page.locator('.navbar-sidebar');
  await expect(mobileSidebar).toBeVisible();
  await mobileSidebar.getByRole('link', {name: 'Getting Started', exact: true}).click();
  await expect(page).toHaveURL(/\/docs\/category\/getting-started$/);
});
