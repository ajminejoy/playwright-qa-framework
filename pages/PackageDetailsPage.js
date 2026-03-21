const { expect } = require('@playwright/test');

class PackageDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async assertPackageName(packageName) {
    await expect(this.page.getByText(packageName, { exact: false })).toBeVisible();
  }

  async assertLocation(locationText) {
    await expect(this.page.getByText(locationText, { exact: false })).toBeVisible();
  }

  async assertTimeSlot(slotText) {
    await expect(this.page.getByText(slotText, { exact: false })).toBeVisible();
  }

  async assertActiveStatus() {
    await expect(this.page.getByText(/active/i).first()).toBeVisible();
  }

  async assertPaymentPaidFull() {
    await expect(this.page.getByText(/payment paid full/i)).toBeVisible();
  }
}

module.exports = PackageDetailsPage;