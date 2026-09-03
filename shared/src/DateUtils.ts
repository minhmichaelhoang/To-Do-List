/** Formatiert Jahr/Monat/Tag als ISO-Datum (YYYY-MM-DD), Monat/Tag zweistellig gepaddet. `month` ist 1-12 (nicht 0-indexiert wie bei `Date.getMonth()`). */
export function formatIsoDate(year: number, month: number, day: number): string {
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Heutiges Datum in der lokalen Zeitzone als ISO-Datum (YYYY-MM-DD). */
export function today(): string {
	const now = new Date();
	return formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Addiert `days` Tage auf ein ISO-Datum (YYYY-MM-DD) und liefert das
 * Ergebnis wieder als ISO-Datum. Rechnet über `Date`, damit Monats-/
 * Jahreswechsel und Schaltjahre automatisch stimmen. Das `T00:00:00` beim
 * Parsen ist wichtig: ohne Uhrzeit interpretiert `Date` einen reinen
 * Datums-String als UTC und verschiebt ihn je nach Zeitzone um einen Tag.
 */
export function addDays(isoDate: string, days: number): string {
	const date = new Date(`${isoDate}T00:00:00`);
	date.setDate(date.getDate() + days);
	return formatIsoDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
