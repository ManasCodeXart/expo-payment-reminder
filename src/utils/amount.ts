const MAX_INTEGER_DIGITS = 7;
const MAX_DECIMAL_DIGITS = 2;

/**
 * Appends a key to a currency amount string, enforcing:
 * - at most one decimal separator
 * - at most MAX_DECIMAL_DIGITS digits after it
 * - at most MAX_INTEGER_DIGITS digits before it
 * - no leading zero (e.g. "0" + "5" -> "5", not "05")
 */
function append(amount: string, key: string, decimalSeparator: string): string {
  if (key === decimalSeparator) {
    return amount.includes(decimalSeparator) ? amount : amount + decimalSeparator;
  }

  const hasDecimal = amount.includes(decimalSeparator);
  if (hasDecimal) {
    const fraction = amount.split(decimalSeparator)[1] ?? '';
    return fraction.length >= MAX_DECIMAL_DIGITS ? amount : amount + key;
  }

  if (amount === '0') return key;
  return amount.length >= MAX_INTEGER_DIGITS ? amount : amount + key;
}

function deleteLast(amount: string): string {
  const next = amount.slice(0, -1);
  return next === '' ? '0' : next;
}

export const parseAmountKeyPress = { append, delete: deleteLast };