import numeral from 'numeral';

export default function formatDisplayNumber(number) {
  const displayNumber = number < 1000 ? numeral(number).format('0.[0]') : numeral(number).format('0.0a');
  return displayNumber;
}
