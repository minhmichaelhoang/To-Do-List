import { describe, expect, it } from "vitest";
import { addDays, formatIsoDate, today } from "../src/DateUtils";

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

describe("addDays", () => {
	it("addiert Tage innerhalb desselben Monats", () => {
		expect(addDays("2026-03-05", 7)).toBe("2026-03-12");
	});

	it("rechnet über eine Monatsgrenze hinweg", () => {
		expect(addDays("2026-01-28", 5)).toBe("2026-02-02");
	});

	it("rechnet über eine Jahresgrenze hinweg", () => {
		expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
	});

	it("berücksichtigt den Schalttag in einem Schaltjahr", () => {
		expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
	});

	it("überspringt den 29. Februar in einem Nicht-Schaltjahr", () => {
		expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
	});

	it("gibt das Datum unverändert zurück, wenn 0 Tage addiert werden", () => {
		expect(addDays("2026-03-05", 0)).toBe("2026-03-05");
	});

	it("verschiebt das Datum nicht durch eine Zeitzonen-Umrechnung", () => {
		expect(addDays("2026-06-15", 1)).toBe("2026-06-16");
	});
});
