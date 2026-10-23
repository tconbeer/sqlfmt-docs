// @ts-check
import {test as base, expect} from '@playwright/test';

// Stand-in for Pyodide so the playground is deterministic and offline.
// "Formatting" lowercases the query and ensures a trailing newline; a query
// containing SYNTAX_ERROR rejects, like sqlfmt does on unparseable input.
const FAKE_PYODIDE = `
window.__pyodideCalls = [];
window.loadPyodide = async () => {
  const globals = {};
  return {
    globals,
    loadPackage: async () => {},
    pyimport: () => ({ install: async (pkg) => { window.__micropipInstalled = pkg; } }),
    runPythonAsync: async () => {
      window.__pyodideCalls.push({
        code: globals.code,
        line_length: globals.line_length,
        no_jinjafmt: globals.no_jinjafmt,
      });
      if (String(globals.code).includes('SYNTAX_ERROR')) {
        throw new Error('SqlfmtParsingError');
      }
      return String(globals.code).trim().toLowerCase() + '\\n';
    },
  };
};
`;

/**
 * Every page gets: external requests stubbed (no network, no analytics),
 * and console errors / failed same-origin requests collected for assertion.
 */
export const test = base.extend({
  pageErrors: [
    async ({page, baseURL}, use) => {
    /** @type {string[]} */
    const errors = [];
    const origin = new URL(/** @type {string} */ (baseURL)).origin;

    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.endsWith('/pyodide.js')) {
        return route.fulfill({contentType: 'text/javascript', body: FAKE_PYODIDE});
      }
      // posthog and anything else off-site: answer empty instead of hitting the network.
      return route.fulfill({status: 204, body: ''});
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('requestfailed', (req) => {
      if (req.url().startsWith(origin)) {
        errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`);
      }
    });
    page.on('response', (res) => {
      if (res.url().startsWith(origin) && res.status() >= 400) {
        errors.push(`http ${res.status()}: ${res.url()}`);
      }
    });

    await use(errors);
    },
    {auto: true},
  ],
});

export {expect};
