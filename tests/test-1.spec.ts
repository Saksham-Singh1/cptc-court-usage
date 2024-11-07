import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://cptc.gametime.net./auth');
  await page.getByLabel('User Name:').click();
  await page.getByLabel('User Name:').fill('RajeshKSingh76');
  await page.getByLabel('User Name:').press('Tab');
  await page.getByLabel('Password:').fill('FanduCPCT76!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Password:').click();
  await page.getByLabel('Password:').fill('FanduCPCT76');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'TENNIS' }).click();
  
  await page.getByRole('link', { name: 'Tuesday' }).click();
  await page.getByRole('link', { name: 'Tuesday' }).click();
  await page.getByRole('link', { name: 'Thursday' }).click();
  await page.getByRole('link', { name: 'Friday' }).click();
  await page.getByRole('link', { name: 'Friday' }).click();
  await page.getByRole('link', { name: 'Sunday' }).click();
});