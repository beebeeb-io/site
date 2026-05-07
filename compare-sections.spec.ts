import { test } from '@playwright/test';
import path from 'path';

const DESIGN = `file://${process.env.HOME}/Downloads/launch 2/dist/index.html`;
const SITE = 'http://localhost:4321';

const sections = [
  { name: 'hero',      y: 0 },
  { name: 'problem',   y: 700 },
  { name: 'approach',  y: 1400 },
  { name: 'product',   y: 2100 },
  { name: 'cli',       y: 2900 },
  { name: 'pricing',   y: 3400 },
  { name: 'cta',       y: 4000 },
];

for (const { name, y } of sections) {
  test(`ref-${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(DESIGN, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.evaluate(() => document.querySelectorAll('[style*="position: fixed"]').forEach(el => el.remove()));
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `qa-screenshots/cmp-ref-${name}.png` });
  });
  test(`site-${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(SITE, { waitUntil: 'networkidle' });
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `qa-screenshots/cmp-site-${name}.png` });
  });
}
