const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('input[type="email"], input[name="email"]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    this.signInButton = page.getByRole('button', { name: /submit/i });
  }

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/sign-in/`);
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async assertLoggedIn() {
    await expect(this.page).not.toHaveURL(/sign-in/i);
  }
}

module.exports = LoginPage;