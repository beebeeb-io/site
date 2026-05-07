import { test } from '@playwright/test';

const REF_DIR = `file://${process.env.HOME}/Downloads/launch 2/dist`;
const SITE = 'http://localhost:4321';

const pages = ['index', 'pricing', 'security'];

test.beforeAll(async ({ browser }) => {});

for (const page of pages) {
  test(`capture ref: ${page}`, async ({ page: p }) => {
    const url = page === 'index' ? `${REF_DIR}/index.html` : `${REF_DIR}/${page}.html`;
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3000);
    await p.evaluate(() => document.querySelectorAll('[style*="position: fixed"]').forEach(e => e.remove()));
    await p.screenshot({ path: `qa-screenshots/ref-${page}.png`, fullPage: true });
  });

  test(`capture site: ${page}`, async ({ page: p }) => {
    const url = page === 'index' ? SITE + '/' : `${SITE}/${page}`;
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.screenshot({ path: `qa-screenshots/site-${page}.png`, fullPage: true });
  });
}
