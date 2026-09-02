const DAYS_IN_WEEK = 7;

/** Wandelt `Date.getDay()` (0=Sonntag...6=Samstag) in eine 1-indexierte Montag-zuerst-Position um (1=Montag...7=Sonntag), passend zu den Wochentags-Initialen im Kalender-Kopf. */
function adjustDayOfWeek(day: number): number {
	if (day === 0) day = 7;
	return day;
}

/** Letzter Tag des angegebenen Kalendermonats (`month` ist 1-12) – `new Date(year, month, 0)` ist der Tag vor Tag 1 des Folgemonats, also der letzte Tag dieses Monats. */
function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

/**
 * Reine Berechnung des Kalender-Grids für einen Monat, ohne JSX: eine Liste
 * von Wochen, jede Woche eine Liste aus sieben Einträgen (Tageszahl oder
 * `null` als Auffüll-Platzhalter vor dem ersten bzw. nach dem letzten Tag
 * des Monats). Arbeitet rein mit Ganzzahlen statt ein `Date`-Objekt
 * schrittweise zu mutieren, damit die üblichen `Date`-Stolperfallen (Tag
 * defaultet auf 1, Monat 0-indexiert) gar nicht erst auftreten können.
 */
export function getCalendarWeeks(year: number, month: number): Array<Array<number | null>> {
	const daysInMonth = getDaysInMonth(year, month);
	const firstWeekdayPosition = adjustDayOfWeek(new Date(year, month - 1, 1).getDay());
	const leadingEmptyCount = firstWeekdayPosition - 1;

	const days: Array<number | null> = [
		...Array.from({length: leadingEmptyCount}, () => null),
		...Array.from({length: daysInMonth}, (_, i) => i + 1),
	];

	const trailingEmptyCount = (DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK)) % DAYS_IN_WEEK;
	days.push(...Array.from({length: trailingEmptyCount}, () => null));

	const weeks: Array<Array<number | null>> = [];
	for (let i = 0; i < days.length; i += DAYS_IN_WEEK) {
		weeks.push(days.slice(i, i + DAYS_IN_WEEK));
	}

	return weeks;
}
