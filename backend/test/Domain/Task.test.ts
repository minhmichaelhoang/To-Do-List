import { describe, expect, it } from "vitest";
import { Task } from "../../src/Domain/Task";
import { today } from "shared";

describe("Task.resolveDate", () => {
	it("gibt undefined zurück, wenn weder Datum noch Uhrzeit gesetzt sind", () => {
		expect(Task.resolveDate(undefined, undefined)).toBeUndefined();
	});

	it("gibt das übergebene Datum unverändert zurück", () => {
		expect(Task.resolveDate("2099-01-01", undefined)).toBe("2099-01-01");
	});

	it("setzt das heutige Datum ein, wenn nur eine Uhrzeit übergeben wird", () => {
		expect(Task.resolveDate(undefined, "14:30")).toBe(today());
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

describe("Task Titellänge", () => {
	it("erlaubt einen Titel mit genau 50 Zeichen", () => {
		expect(() => new Task("a".repeat(50), "Beschreibung", "project-id")).not.toThrow();
	});

	it("wirft im Konstruktor bei einem Titel mit mehr als 50 Zeichen", () => {
		expect(() => new Task("a".repeat(51), "Beschreibung", "project-id")).toThrow();
	});

	it("wirft im Setter bei einem Titel mit mehr als 50 Zeichen", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");
		expect(() => (task.title = "a".repeat(51))).toThrow();
	});
});

describe("Task Setter", () => {
	it("überschreibt Description, projectId, date, time, duration und repeat", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");

		task.Description = "Neue Beschreibung";
		task.projectId = "anderes-project-id";
		task.date = "2099-01-01";
		task.time = "10:00";
		task.duration = 90;
		task.repeat = 7;

		expect(task.Description).toBe("Neue Beschreibung");
		expect(task.projectId).toBe("anderes-project-id");
		expect(task.date).toBe("2099-01-01");
		expect(task.time).toBe("10:00");
		expect(task.duration).toBe(90);
		expect(task.repeat).toBe(7);
	});

	it("erlaubt, date, time, duration und repeat wieder auf undefined zu setzen", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", "10:00", 90, 7);

		task.date = undefined;
		task.time = undefined;
		task.duration = undefined;
		task.repeat = undefined;

		expect(task.date).toBeUndefined();
		expect(task.time).toBeUndefined();
		expect(task.duration).toBeUndefined();
		expect(task.repeat).toBeUndefined();
	});
});

describe("Task duration", () => {
	it("übernimmt die im Konstruktor übergebene duration", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", "10:00", 60);

		expect(task.duration).toBe(60);
	});

	it("ist undefined, wenn keine duration übergeben wird", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");

		expect(task.duration).toBeUndefined();
	});
});

describe("Task repeat", () => {
	it("übernimmt das im Konstruktor übergebene repeat", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", "10:00", 60, 7);

		expect(task.repeat).toBe(7);
	});

	it("ist undefined, wenn kein repeat übergeben wird", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");

		expect(task.repeat).toBeUndefined();
	});

	it("erlaubt 0 als gültigen Wert (fachlich: keine Wiederholung)", () => {
		expect(() => new Task("Titel", "Beschreibung", "project-id", undefined, undefined, undefined, 0)).not.toThrow();
	});

	it("erlaubt beliebige positive Ganzzahlen", () => {
		expect(() => new Task("Titel", "Beschreibung", "project-id", undefined, undefined, undefined, 365)).not.toThrow();
	});

	it("wirft im Konstruktor bei einem negativen Wert", () => {
		expect(() => new Task("Titel", "Beschreibung", "project-id", undefined, undefined, undefined, -1)).toThrow();
	});

	it("wirft im Konstruktor bei einer Kommazahl", () => {
		expect(() => new Task("Titel", "Beschreibung", "project-id", undefined, undefined, undefined, 1.5)).toThrow();
	});

	it("wirft im Setter bei einem negativen Wert", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");
		expect(() => (task.repeat = -1)).toThrow();
	});

	it("wirft im Setter bei einer Kommazahl", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");
		expect(() => (task.repeat = 2.5)).toThrow();
	});
});
