import { describe, expect, it } from "vitest";
import { Task } from "../../src/Domain/Task";

/** Lokales (nicht UTC-) Datum als YYYY-MM-DD, passend zu `Task`s eigener Berechnung von "heute". */
function todayLocal(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

describe("Task.resolveDate", () => {
	it("gibt undefined zurück, wenn weder Datum noch Uhrzeit gesetzt sind", () => {
		expect(Task.resolveDate(undefined, undefined)).toBeUndefined();
	});

	it("gibt das übergebene Datum unverändert zurück", () => {
		expect(Task.resolveDate("2099-01-01", undefined)).toBe("2099-01-01");
	});

	it("setzt das heutige Datum ein, wenn nur eine Uhrzeit übergeben wird", () => {
		expect(Task.resolveDate(undefined, "14:30")).toBe(todayLocal());
	});
});

describe("Task.assertNotInPast", () => {
	it("wirft nicht, wenn weder Datum noch Uhrzeit gesetzt sind", () => {
		expect(() => Task.assertNotInPast(undefined, undefined)).not.toThrow();
	});

	it("wirft nicht bei einem Datum in der Zukunft ohne Uhrzeit", () => {
		expect(() => Task.assertNotInPast("2099-01-01", undefined)).not.toThrow();
	});

	it("wirft bei einem Datum in der Vergangenheit ohne Uhrzeit", () => {
		expect(() => Task.assertNotInPast("2000-01-01", undefined)).toThrow();
	});

	it("wirft nicht bei Datum und Uhrzeit in der Zukunft", () => {
		expect(() => Task.assertNotInPast("2099-01-01", "12:00")).not.toThrow();
	});

	it("wirft bei Datum und Uhrzeit in der Vergangenheit", () => {
		expect(() => Task.assertNotInPast("2000-01-01", "12:00")).toThrow();
	});

	it("wirft bei einer bereits vergangenen Uhrzeit am heutigen Tag", () => {
		expect(() => Task.assertNotInPast(undefined, "00:00")).toThrow();
	});
});
