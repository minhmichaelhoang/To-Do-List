import { describe, expect, it } from "vitest";
import { getCalendarWeeks } from "../../../../src/features/tasks/components/CalendarGrid";

describe("getCalendarWeeks", () => {
	it("jede Woche hat genau 7 Einträge", () => {
		const weeks = getCalendarWeeks(2026, 3);

		for (const week of weeks) {
			expect(week).toHaveLength(7);
		}
	});

	it("füllt die erste Woche korrekt auf, wenn der Monat an einem Montag beginnt", () => {
		// März 2027 beginnt an einem Montag
		const weeks = getCalendarWeeks(2027, 3);

		expect(weeks[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it("füllt die erste Woche mit führenden null-Platzhaltern auf, wenn der Monat nicht an einem Montag beginnt", () => {
		// März 2026 beginnt an einem Sonntag -> 6 führende Platzhalter, dann Tag 1
		const weeks = getCalendarWeeks(2026, 3);

		expect(weeks[0]).toEqual([null, null, null, null, null, null, 1]);
	});

	it("enthält alle Tage des Monats genau einmal, ohne Lücke oder Duplikat", () => {
		const weeks = getCalendarWeeks(2026, 2); // Februar 2026 (28 Tage, kein Schaltjahr)

		const days = weeks.flat().filter((day): day is number => day !== null);
		expect(days).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
	});

	it("berücksichtigt Schaltjahre (Februar 2028 hat 29 Tage)", () => {
		const weeks = getCalendarWeeks(2028, 2);

		const days = weeks.flat().filter((day): day is number => day !== null);
		expect(days).toHaveLength(29);
		expect(days[days.length - 1]).toBe(29);
	});

	it("füllt die letzte Woche mit nachfolgenden null-Platzhaltern auf, falls nötig", () => {
		const weeks = getCalendarWeeks(2026, 3);
		const lastWeek = weeks[weeks.length - 1];

		const trailingNulls = lastWeek.filter((day) => day === null).length;
		const trailingDays = lastWeek.filter((day) => day !== null).length;

		expect(trailingNulls + trailingDays).toBe(7);
		expect(lastWeek.slice(0, trailingDays).every((day) => day !== null)).toBe(true);
	});
});
