/** Formatiert Jahr/Monat/Tag als ISO-Datum (YYYY-MM-DD), Monat/Tag zweistellig gepaddet. `month` ist 1-12 (nicht 0-indexiert wie bei `Date.getMonth()`). */
export function formatIsoDate(year: number, month: number, day: number): string {
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Heutiges Datum in der lokalen Zeitzone als ISO-Datum (YYYY-MM-DD). */
export function today(): string {
	const now = new Date();
	return formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
