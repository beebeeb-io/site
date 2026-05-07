import { test, expect, chromium } from '@playwright/test';
import path from 'path';

const DESIGN_DIR = path.join(process.env.HOME, 'Downloads/launch 2/dist');
const SITE_URL = 'http://localhost:4321';

const pages = [
  { name: 'index',   design: `file://${DESIGN_DIR}/index.html`,   site: `${SITE_URL}/`         },
  { name: 'pricing', design: `file://${DESIGN_DIR}/pricing.html`, site: `${SITE_URL}/pricing`  },
  { name: 'security',design: `file://${DESIGN_DIR}/security.html`,site: `${SITE_URL}/security` },
];

for (const { name, design, site } of pages) {
  test(`${name} — reference screenshot`, async ({ page }) => {
    await page.goto(design, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // React app unpack time
    // Remove tweaks panel
    await page.evaluate(() => {
      document.querySelectorAll('[style*="position: fixed"]').forEach(el => el.remove());
    });
    await page.screenshot({ path: `qa-screenshots/ref-${name}.png`, fullPage: true });
  });

  test(`${name} — site screenshot`, async ({ page }) => {
    await page.goto(site, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `qa-screenshots/site-${name}.png`, fullPage: true });
  });
}
