/**
 * Prices are stored as integer cents everywhere in the app to avoid floating
 * point drift when summing the cart. Formatting happens only at the edges.
 */
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const usdWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(cents) {
  return usd.format((cents ?? 0) / 100);
}

/** Drops the ".00" when a price is a whole dollar amount. */
export function formatPriceCompact(cents) {
  const value = (cents ?? 0) / 100;
  return Number.isInteger(value) ? usdWhole.format(value) : usd.format(value);
}

export function formatPerMonth(cents) {
  return `${formatPrice(cents)}/mo`;
}
