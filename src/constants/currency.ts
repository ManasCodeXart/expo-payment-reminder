/** Shared currency format for every monetary value across the reminder flow. */
export const AMOUNT_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: 'decimal',
  maximumFractionDigits: 0,
};

/** Literal currency symbol rendered ahead of every formatted amount. */
export const CURRENCY_PREFIX = '$';
