export function formatCurrency(
  amount: number,
  options?: { showCents: boolean },
): string {
  const { showCents = true } = options || {};
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: showCents ? 2 : 0,
    minimumFractionDigits: showCents ? 2 : 0,
    style: "currency",
  }).format(amount);
}
