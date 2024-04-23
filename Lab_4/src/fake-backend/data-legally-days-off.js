/**
 * @type {LegallyDaysOffBE}
 */
const LEGALLY_DAYS_OFF = [
  {
    date: new Date(2023, 01, 01).toISOString().split('T')[0],
    description: 'Anul nou',
  },
  {
    date: new Date(2023, 02, 15).toISOString().split('T')[0],
    description: 'Adormirea Maicii Domnului',
  },
  {
    date: new Date(2023, 06, 01).toISOString().split('T')[0],
    description: 'Ziua copilului',
  },
  {
    date: new Date(2023, 08, 10).toISOString().split('T')[0],
    description: 'Sfanta Roxana',
  },
  {
    date: new Date(2023, 09, 11).toISOString().split('T')[0],
    description: 'Ziua Roxanei',
  },
];

module.exports = LEGALLY_DAYS_OFF;
