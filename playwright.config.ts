import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3123)
const baseURL = `http://localhost:${PORT}`

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
}

if (process.env.CI) {
  config.workers = 1
}

export default defineConfig(config)
