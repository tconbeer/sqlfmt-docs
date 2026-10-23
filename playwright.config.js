// @ts-check
import {defineConfig, devices} from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3123);

// Set PLAYWRIGHT_BASE_URL to test an already running site (e.g. the Docker
// image) instead of starting `docusaurus serve`.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

// Set PLAYWRIGHT_CHROMIUM_EXECUTABLE to use a preinstalled Chromium build.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

// Set PLAYWRIGHT_CHANNEL (e.g. `chrome`) to use an installed browser channel;
// CI uses the runner's preinstalled Chrome.
const channel = process.env.PLAYWRIGHT_CHANNEL || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: externalBaseURL || `http://127.0.0.1:${PORT}`,
    colorScheme: 'light',
    trace: 'retain-on-failure',
    launchOptions: {executablePath},
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome'], channel}}],
  // Serves the production build; run `npm run build` first (or `npm test`).
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npx docusaurus serve --port ${PORT} --host 127.0.0.1 --no-open`,
        url: `http://127.0.0.1:${PORT}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
