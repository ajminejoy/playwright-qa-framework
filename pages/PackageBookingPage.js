const { expect } = require('@playwright/test');

class PackageBookingPage {
  constructor(page) {
    this.page = page;

    this.addNewPackageButton = page.getByRole('button', { name: /add a new package|add new package/i });
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.completeButton = page.getByRole('button', { name: /complete/i });
    this.paymentPaidFullBadge = page.getByText(/payment paid full/i);
  }

  async clickAddNewPackage() {
    await this.addNewPackageButton.click();
  }

  async selectAnyAvailableScan() {
    const scanCards = this.page.locator('div').filter({ hasText: /Scan/i });
    await scanCards.first().click();
  }

  async continueToScheduling() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }

  async selectLocation(locationText) {
    await this.page.getByText(locationText, { exact: false }).first().click();
    await this.page.locator('.vuecal__cell').first().waitFor();
  }

  async selectFirstAvailableDate() {
    const availableDates = this.page.locator('.vuecal__cell:not(.vuecal__cell--disabled)');
    const count = await availableDates.count();

    for (let i = 0; i < count; i++) {
      const dateCell = availableDates.nth(i);

      if (!(await dateCell.isVisible().catch(() => false))) {
        continue;
      }

      const className = (await dateCell.getAttribute('class').catch(() => '')) || '';
      const text = ((await dateCell.textContent().catch(() => '')) || '').trim();

      if (!/vuecal__cell--day\d/i.test(className)) {
        continue;
      }

      if (!text) {
        continue;
      }

      await dateCell.scrollIntoViewIfNeeded();
      await dateCell.click();

      // Wait for time slots to appear after date selection
      await this.page
        .locator('.appointments__individual-appointment input[type="radio"]')
        .first()
        .waitFor();

      return text;
    }

    throw new Error('No available calendar date was found.');
  }

  async selectTimeSlotByIndex(index) {
    const appointments = this.page.locator('.appointments__individual-appointment');
    const count = await appointments.count();

    let visibleIndex = -1;

    for (let i = 0; i < count; i++) {
      const appointment = appointments.nth(i);

      if (!(await appointment.isVisible().catch(() => false))) {
        continue;
      }

      const radio = appointment.locator('input[type="radio"]').first();

      if (!(await radio.isVisible().catch(() => false))) {
        continue;
      }

      visibleIndex++;

      if (visibleIndex === index) {
        const slotId = await radio.getAttribute('id');
        const label = slotId
          ? this.page.locator(`label[for="${slotId}"]`).first()
          : appointment.locator('label').first();

        const slotText = ((await label.textContent().catch(() => '')) || '').trim();

        await label.scrollIntoViewIfNeeded();
        await label.click();

        await this.page.waitForTimeout(300);

        return slotText;
      }
    }

    throw new Error(`Could not find available time slot at index ${index}.`);
  }

  async selectThreeTimeSlotsForOneDate() {
    const selections = [];

    for (let i = 0; i < 3; i++) {
      const timeText = await this.selectTimeSlotByIndex(i);
      selections.push(timeText);
    }

    return selections;
  }

  async continueToPayment() {
    await expect(this.continueButton).toBeEnabled();
    await this.continueButton.click();
  }

  async completeBooking() {
    await this.completeButton.click();
  }

  async assertBookingSucceeded() {
    await expect(this.paymentPaidFullBadge).toBeVisible();
    await expect(this.page.getByText(/active/i).first()).toBeVisible();
  }

  async openCreatedPackage(packageNameText) {
    await this.page.getByText(packageNameText, { exact: false }).first().click();
  }
}

module.exports = PackageBookingPage;