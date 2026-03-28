const { expect } = require('@playwright/test');

class MembersPage {
  constructor(page) {
    this.page = page;

    this.addMemberButton = page.getByRole('button', { name: '+ Member', exact: true });

    this.modalTitle = page.getByRole('heading', { name: 'Add a member' });
    this.firstNameInput = page.getByLabel('Legal First Name');
    this.lastNameInput = page.getByLabel('Legal Last Name');
    this.emailInput = page.getByLabel('Email');
    this.phoneInput = page.locator('input[name="phoneNumber"], input[type="tel"]').first();
    this.dobInput = page.getByLabel('Date of Birth (MM-DD-YYYY)');
    this.sexDropdown = page.locator('[data-name="gender"] .multiselect');
    this.continueButton = page.getByRole('button', { name: /continue/i });
  }

  async assertMembersPageLoaded() {
    await expect(this.addMemberButton).toBeVisible();
  }

  async clickAddMember() {
    await this.addMemberButton.click();
  }

  async assertAddMemberModalVisible() {
    await expect(this.modalTitle).toBeVisible();
  }

  async selectGender(value = 'Male') {
    await this.sexDropdown.click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async createMember(member) {
  await this.clickAddMember();
  await this.assertAddMemberModalVisible();

  await this.firstNameInput.fill(member.firstName);
  await this.lastNameInput.fill(member.lastName);
  await this.emailInput.fill(member.email);

  await this.phoneInput.click();
  await this.phoneInput.fill(member.phone);

  await this.dobInput.fill(member.dob);

  await this.selectSex(member.sex);

  await expect(this.continueButton).toBeEnabled();
  await this.continueButton.click();
}

  async assertMemberCreated() {
    await expect(this.modalTitle).not.toBeVisible();
  }

  async openNewestMember(context) {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      this.page.locator('tbody tr').first().click(),
    ]);

    await newPage.waitForLoadState();
    return newPage;
  }
}

module.exports = MembersPage;