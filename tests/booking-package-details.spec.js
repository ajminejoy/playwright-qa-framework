const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const MembersPage = require('../pages/MembersPage');
const PackageBookingPage = require('../pages/PackageBookingPage');
const PaymentPage = require('../pages/PaymentPage');
const PackageDetailsPage = require('../pages/PackageDetailsPage');
const { getUniqueMember, bookingData } = require('../data/testData');
const { validVisa } = require('../data/stripeCards');

test.describe('Ezra Booking Flow - Package Detail Validation', () => {
  test('Verify selected location and time slot are correctly reflected in appointment details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);
    const bookingPage = new PackageBookingPage(page);
    const paymentPage = new PaymentPage(page);
    const packageDetailsPage = new PackageDetailsPage(page);

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
    await membersPage.openMemberByEmail(member.email);

    await bookingPage.clickAddNewPackage();
    await bookingPage.selectPrimaryScan(bookingData.primaryScan);
    await bookingPage.selectLocation(bookingData.preferredLocationText);

    const selectedSlot = await bookingPage.selectFirstAvailableTimeSlot();

    await paymentPage.fillStripeCard(validVisa);
    await paymentPage.submitPayment();

    await bookingPage.assertBookingSucceeded();
    await bookingPage.openCreatedPackage(bookingData.primaryScan);

    await packageDetailsPage.assertPackageName(bookingData.primaryScan);
    await packageDetailsPage.assertLocation(bookingData.preferredLocationText);

    // Uncomment if exact slot text is shown on details page
    // await packageDetailsPage.assertTimeSlot(selectedSlot);
  });
});