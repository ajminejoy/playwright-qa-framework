const firstNames = [
  'Calvin',
  'Dorian',
  'Jasper',
  'Lennon',
  'Milo',
  'Orion',
  'Rowan',
  'Silas',
  'Tobin',
  'Wesley'
];

const lastNames = [
  'Bennett',
  'Calloway',
  'Donovan',
  'Ellsworth',
  'Hawthorne',
  'Kingsley',
  'Prescott',
  'Remington',
  'Sullivan',
  'Winslow'
];

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const getUniqueMember = () => {
  const timestamp = Date.now().toString();
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);

  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@example.com`,
    phone: `201555${timestamp.slice(-4)}`,
    dob: '01-01-1990',
    sex: 'Male'
  };
};

module.exports = {
  getUniqueMember,

  bookingData: {
    preferredLocationText: 'QA Automation Center',
  },
};