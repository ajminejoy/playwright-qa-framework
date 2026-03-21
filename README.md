# Ezra Automation Assessment – Playwright

## Overview

This project demonstrates an end-to-end automation framework built using Playwright.

The goal was to automate a core user journey:
- Login
- Create a member
- Book a scan
- Schedule appointments
- Complete payment
- Validate booking success

The framework is designed using the Page Object Model (POM) for scalability and maintainability.

---

## Setup

1. Install dependencies:

npm install

2. Install Playwright browsers:

npx playwright install

3. Create a `.env` file in the root:

LOGIN_EMAIL=your_email  
LOGIN_PASSWORD=your_password  

---

## Running Tests

npm run test:success

or

npx playwright test

---

## Project Structure

pages/   → Page Object classes  
tests/   → Test cases  
data/    → Test data  
utils/   → Helpers  

---

## Design Approach

The framework uses the Page Object Model (POM):
- Each page contains its own locators and actions
- Tests remain clean and readable
- Improves reusability and scalability

---

## Test Strategy

The automated test focuses on a high-value user flow:
- Booking and payment are critical business paths
- Multi-step flow validates system integration end-to-end

---

## Trade-offs & Assumptions

- Some UI elements (calendar, scheduling) are dynamic and may introduce flakiness
- Selectors were designed to be flexible rather than overly rigid
- Lightweight waits were used where necessary to handle async rendering

---

## Future Improvements

Given more time, I would:
- Improve calendar/date selection stability
- Add retry logic for flaky UI elements
- Add negative test cases
- Integrate reporting and CI/CD

---

## Additional Notes
Due to dynamic scheduling behavior in the staging environment (calendar and time slot availability), some test steps may require additional stabilization (e.g., improved synchronization or retry logic) to achieve full consistency.

Part 1 (Test Design) and Part 2/3 (API & Security) are submitted separately as documents.

This repository focuses on the automation implementation.