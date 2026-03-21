const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const MembersPage = require('../pages/MembersPage');
const PackageBookingPage = require('../pages/PackageBookingPage');
const PaymentPage = require('../pages/PaymentPage');
const { getUniqueMember, bookingData } = require('../data/testData');
const { declinedCard } = require('../data/stripeCards');

test.describe('Ezra Booking Flow - Payment Failure', () => {
  test('Verify booking is not created when payment is declined', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    const member = getUniqueMember();

    await loginPage.goto();
    await loginPage.login(
      process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD
    );
    await loginPage.assertLoggedIn();

    await membersPage.assertMembersPageLoaded();
    await membersPage.createMember(member);
    await membersPage.assertMemberCreated();

    const memberPage = await membersPage.openNewestMember(context);

    const bookingPage = new PackageBookingPage(memberPage);
    const paymentPage = new PaymentPage(memberPage);

    await bookingPage.clickAddNewPackage();
    await bookingPage.selectAnyAvailableScan();
    await bookingPage.continueToScheduling();

    await bookingPage.selectLocation(bookingData.preferredLocationText);
    await bookingPage.selectFirstAvailableDate();
    await bookingPage.selectThreeTimeSlotsForOneDate();

    await bookingPage.continueToPayment();

    await paymentPage.fillStripeCard(declinedCard);
    await paymentPage.submitPayment();

    await paymentPage.assertPaymentErrorVisible();
    await expect(memberPage.getByText(/payment paid full/i)).not.toBeVisible();
  });
});