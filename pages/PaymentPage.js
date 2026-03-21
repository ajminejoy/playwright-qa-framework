const { expect } = require('@playwright/test');

class PaymentPage {
  constructor(page) {
    this.page = page;
    this.completeButton = page.getByRole('button', { name: /complete/i });
  }

  async fillStripeCard(card) {
    const cardNumberFrame = this.page.frameLocator('iframe[name*="cardNumber"], iframe[title*="card number" i]').first();
    const cardExpiryFrame = this.page.frameLocator('iframe[name*="cardExpiry"], iframe[title*="expiration" i]').first();
    const cardCvcFrame = this.page.frameLocator('iframe[name*="cardCvc"], iframe[title*="security code" i]').first();
    const postalCodeFrame = this.page.frameLocator('iframe[name*="postalCode"], iframe[title*="ZIP" i]').first();

    await cardNumberFrame.locator('input[name="cardnumber"], input').fill(card.number);
    await cardExpiryFrame.locator('input[name="exp-date"], input').fill(card.exp);
    await cardCvcFrame.locator('input[name="cvc"], input').fill(card.cvc);

    if (await postalCodeFrame.locator('input').isVisible().catch(() => false)) {
      await postalCodeFrame.locator('input').fill(card.zip);
    }
  }

  async submitPayment() {
    await this.completeButton.click();
  }

  async assertPaymentErrorVisible() {
    await expect(
      this.page.getByText(/declined|failed|card was declined|payment failed/i)
    ).toBeVisible();
  }
}

module.exports = PaymentPage;