import { test, expect } from '@playwright/test';

test.describe('Culling Games Control Panel E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to application page
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForSelector('app-player-grid');

    // Register a one-time dialog handler for the reset confirmation dialog
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    const resetButton = page.locator('button[title="Reset System to Default Sorcerers"]');
    await resetButton.click();
    
    // Wait a brief moment for reset database request to resolve
    await page.waitForTimeout(500);
  });

  test('should load page and render statistics correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Culling Games Control Panel/);

    // Locate stats headers
    const totalPlayers = page.locator('span:has-text("Active Sorcerers") >> xpath=../span[2]');
    const totalPoints = page.locator('span:has-text("Points Distributed") >> xpath=../span[2]');
    const deceasedRate = page.locator('span:has-text("Deceased Rate") >> xpath=../span[2]');

    // Initial seed stats: 9 players total (6 Alive, 3 Deceased), sum of points = 773
    await expect(totalPlayers).toHaveText('9');
    await expect(totalPoints).toHaveText('773');
    await expect(deceasedRate).toHaveText('33%');
  });

  test('should register a new sorcerer and display in grid', async ({ page }) => {
    // Fill the registration form
    await page.fill('label:has-text("Sorcerer Name") >> xpath=../input', 'Kento Nanami');
    
    // Select starting colony
    const colonySelect = page.locator('label:has-text("Starting Colony") >> xpath=../select');
    await colonySelect.selectOption({ value: 'Tokyo Colony No. 1' });

    // Fill Cursed Technique
    await page.fill('label:has-text("Cursed Technique") >> xpath=../textarea', 'Ratio Technique (7:3)');
    
    // Fill starting points
    await page.fill('label:has-text("Starting Points") >> xpath=../input', '73');

    // Select initial status
    const statusSelect = page.locator('label:has-text("Initial Status") >> xpath=../select');
    await statusSelect.selectOption({ value: 'Alive' });

    // Submit form (use force: true to bypass any host element interception)
    await page.click('button[type="submit"]:has-text("Enter the Culling Game")', { force: true });

    // Verify Kento Nanami is in grid card list
    const firstCardTitle = page.locator('app-player-grid >> h3').first();
    await expect(firstCardTitle).toHaveText('Kento Nanami');

    // Verify stats updated
    const totalPlayers = page.locator('span:has-text("Active Sorcerers") >> xpath=../span[2]');
    const totalPoints = page.locator('span:has-text("Points Distributed") >> xpath=../span[2]');
    await expect(totalPlayers).toHaveText('10');
    await expect(totalPoints).toHaveText('846');

    // Verify Kogane Broadcast log entry exists
    const logsContainer = page.locator('app-kogane-logs');
    await expect(logsContainer).toContainText('DECLARATION: Kento Nanami entered Tokyo Colony No. 1');
  });

  test('should quickly adjust alive sorcerer points', async ({ page }) => {
    // Locate Yuta's card container specifically
    const yutaCard = page.locator('app-player-grid >> div.bg-zinc-900', { hasText: 'Yuta Okkotsu' }).first();
    const plusButton = yutaCard.locator('button:has-text("+1 PTS")');
    const pointsDisplay = yutaCard.locator('.text-3xl');

    await expect(pointsDisplay).toHaveText('190');
    await plusButton.click();
    await expect(pointsDisplay).toHaveText('191');

    // Click "-1 PTS"
    const minusButton = yutaCard.locator('button:has-text("-1 PTS")');
    await minusButton.click();
    await expect(pointsDisplay).toHaveText('190');
  });

  test('should authorize point transfer between alive players', async ({ page }) => {
    // Switch to Point Transfer tab
    await page.click('button:has-text("Point Transfer")');

    // Select Megumi as Sender
    const senderSelect = page.locator('label:has-text("Sender") >> xpath=../select');
    await senderSelect.selectOption({ label: 'Megumi Fushiguro (40 PTS)' });

    // Select Yuji as Receiver
    const receiverSelect = page.locator('label:has-text("Receiver") >> xpath=../select');
    await receiverSelect.selectOption({ label: 'Yuji Itadori' });

    // Input 40 points to transfer
    const amountInput = page.locator('label:has-text("Points to Transfer") >> xpath=../div/input');
    await amountInput.fill('40');

    // Approve the alert that will trigger (use once to target only this dialog)
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Points successfully transferred');
      await dialog.accept();
    });

    // Authorize transfer
    await page.click('button:has-text("Authorize Transfer")', { force: true });

    // Verify points updated in grid
    const megumiCard = page.locator('app-player-grid >> div.bg-zinc-900', { hasText: 'Megumi Fushiguro' }).first();
    const yujiCard = page.locator('app-player-grid >> div.bg-zinc-900', { hasText: 'Yuji Itadori' }).first();
    
    await expect(megumiCard.locator('.text-3xl')).toHaveText('0');
    await expect(yujiCard.locator('.text-3xl')).toHaveText('41');

    // Check Kogane Broadcast Feed
    const logsContainer = page.locator('app-kogane-logs');
    await expect(logsContainer).toContainText('POINT TRANSFER COMPLETE: Megumi Fushiguro sent 40 PTS to Yuji Itadori');
  });

  test('should view and close the rules modal', async ({ page }) => {
    // Click View rules button in header
    await page.click('button:has-text("View")');

    // Verify modal overlay is open and visible
    const modalDiv = page.locator('app-rules-modal >> div.fixed');
    await expect(modalDiv).not.toHaveClass(/hidden/);
    await expect(modalDiv).toContainText('Culling Game Declarative Rules');

    // Close the modal
    await page.click('button:has-text("Acknowledge Rules")');
    await expect(modalDiv).toHaveClass(/hidden/);
  });
});
