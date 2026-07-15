// Rupee formatting with Indian digit grouping (₹1,29,999 — not ₹129,999).
// Prices in mockData are whole rupees, so no decimals are shown.
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return inr.format(amount);
}
