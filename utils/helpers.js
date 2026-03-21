async function clickIfVisible(locator) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
    }
  }
  
  async function getFirstAvailableSlot(page) {
    const possibleSlotSelectors = [
      '[data-testid="time-slot"]:not([disabled])',
      'button:has-text(":")',
      '.time-slot:not(.disabled)',
      '.calendar-slot:not(.disabled)',
    ];
  
    for (const selector of possibleSlotSelectors) {
      const slot = page.locator(selector).first();
  
      if (await slot.isVisible().catch(() => false)) {
        const slotText = await slot.textContent();
        await slot.click();
        return (slotText || '').trim();
      }
    }
  
    throw new Error('No available time slot could be found. Update slot selectors.');
  }
  
  module.exports = {
    clickIfVisible,
    getFirstAvailableSlot,
  };