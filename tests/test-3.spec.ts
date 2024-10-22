import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cptc.gametime.net./auth');
  await page.getByLabel('User Name:').click();
  await page.getByLabel('User Name:').fill('sks17');
  await page.getByLabel('User Name:').press('Tab');
  await page.getByLabel('Password:').fill('FanduCPCT76');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'TENNIS' }).click();
  await page.getByRole('link', { name: 'Monday 21' }).click();
  await page.getByText('Reed - Courts 1 -').click();
  await page.getByRole('link', { name: 'Wright - Courts 5 -' }).click();
  await page.getByRole('link', { name: 'Roberts - Courts 9 -' }).click();
  await page.getByRole('link', { name: 'Outdoor - Stadium & Courts 14 -' }).click();
  await page.getByRole('link', { name: 'Tuesday' }).click();
  await page.getByRole('link', { name: 'Reed - Courts 1 -' }).click();
  await page.getByRole('link', { name: 'Wright - Courts 5 -' }).click();
  await page.getByRole('link', { name: 'Wednesday' }).click();
  await page.getByRole('link', { name: 'Reed - Courts 1 -' }).click();
  await page.locator('#viewer').click();
});