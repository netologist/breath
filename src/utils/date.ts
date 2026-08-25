/**
 * Formats a Date object to YYYY-MM-DD string.
 * E.g. 2025-02-05
 */
export function formatYMD(date?: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the effective date for an item.
 * Default is 'updated' (falls back to created/date if updated is not set).
 * If 'created' is chosen, falls back to date/updated.
 */
export function getEffectiveDate(
  item: { data: { updated?: Date; date?: Date; created?: Date } },
  sortBy: 'updated' | 'created' = 'updated'
): Date {
  if (sortBy === 'created') {
    return item.data.created ?? item.data.date ?? item.data.updated ?? new Date(0);
  }
  return item.data.updated ?? item.data.date ?? item.data.created ?? new Date(0);
}

/**
 * Sorts items by date descending (newest first).
 * Default sorts by 'updated' date.
 */
export function sortByDate<T extends { data: { updated?: Date; date?: Date; created?: Date } }>(
  items: T[],
  sortBy: 'updated' | 'created' = 'updated'
): T[] {
  return [...items].sort((a, b) => {
    const timeA = getEffectiveDate(a, sortBy).getTime();
    const timeB = getEffectiveDate(b, sortBy).getTime();
    return timeB - timeA;
  });
}

/**
 * Groups items by year based on effective date.
 */
export function groupByYear<T extends { data: { updated?: Date; date?: Date; created?: Date } }>(
  items: T[],
  sortBy: 'updated' | 'created' = 'updated'
): { years: string[]; byYear: Record<string, T[]> } {
  const sorted = sortByDate(items, sortBy);
  const byYear: Record<string, T[]> = {};

  for (const item of sorted) {
    const d = getEffectiveDate(item, sortBy);
    const year = d.getFullYear().toString();
    (byYear[year] ??= []).push(item);
  }

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
  return { years, byYear };
}
