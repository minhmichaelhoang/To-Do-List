import { describe, expect, it } from "vitest";
import { formatIsoDate, today } from "../src/DateUtils";

describe("formatIsoDate", () => {
	it("formatiert Jahr/Monat/Tag als YYYY-MM-DD", () => {
		expect(formatIsoDate(2026, 3, 5)).toBe("2026-03-05");
	});

	it("paddet einstelligen Monat und Tag mit einer führenden Null", () => {
		expect(formatIsoDate(2026, 1, 9)).toBe("2026-01-09");
	});

	it("lässt bereits zweistellige Werte unverändert", () => {
		expect(formatIsoDate(2026, 12, 31)).toBe("2026-12-31");
	});
});

describe("today", () => {
	it("gibt das heutige Datum als YYYY-MM-DD zurück", () => {
		const now = new Date();
		const expected = formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

		expect(today()).toBe(expected);
	});
});
