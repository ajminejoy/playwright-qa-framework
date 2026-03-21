const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const MembersPage = require('../pages/MembersPage');
const PackageBookingPage = require('../pages/PackageBookingPage');
const PaymentPage = require('../pages/PaymentPage');
const PackageDetailsPage = require('../pages/PackageDetailsPage');
const { getUniqueMember, bookingData } = require('../data/testData');
const { validVisa } = require('../data/stripeCards');

test.describe('Ezra Booking Flow - Success Path', () => {
  test('Verify successful end-to-end booking flow with scan selection, add-ons, time slot, and valid payment', async ({ page, context }) => {
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
    const packageDetailsPage = new PackageDetailsPage(memberPage);

    await bookingPage.clickAddNewPackage();
    await bookingPage.selectAnyAvailableScan();
    await bookingPage.continueToScheduling();

    await bookingPage.selectLocation(bookingData.preferredLocationText);
    const selectedDate = await bookingPage.selectFirstAvailableDate();
    const selectedTimes = await bookingPage.selectThreeTimeSlotsForOneDate();

    await bookingPage.continueToPayment();

    await paymentPage.fillStripeCard(validVisa);
    await paymentPage.submitPayment();

    await bookingPage.assertBookingSucceeded();
    await packageDetailsPage.assertLocation(bookingData.preferredLocationText);
    await packageDetailsPage.assertActiveStatus();
    await packageDetailsPage.assertPaymentPaidFull();
  });
});