import { test, expect } from '@playwright/test';

test.describe('/support page', () => {
  test('renders hero and FAQ section', async ({ page }) => {
    await page.goto('/support');
    await expect(page.locator('h1')).toContainText('How can we help');
    await expect(page.locator('#faqSearch')).toBeVisible();
  });

  test('contact form is present', async ({ page }) => {
    await page.goto('/support');
    await expect(page.locator('#supportContactForm')).toBeVisible();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
  });

  test('quick links point to existing pages', async ({ page }) => {
    await page.goto('/support');
    const links = page.locator('a[href="/status"], a[href="/security"], a[href="/docs"], a[href="/bug-bounty"]');
    await expect(links).toHaveCount(4);
  });
});
