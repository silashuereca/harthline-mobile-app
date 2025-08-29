import { DateTime } from "luxon";
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

export function formatDate(dateString: string): string {
  // Trim ISO string to 3 fractional digits (milliseconds)
  const trimmed = dateString.replace(/\.(\d{3})\d+/, ".$1");
  const date = DateTime.fromISO(trimmed);
  return date.isValid
    ? date.toLocaleString(DateTime.DATETIME_MED)
    : "Invalid Date";
}
