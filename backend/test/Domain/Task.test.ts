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
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 0);

		expect(task.repeat).toBe(0);
	});

	it("erlaubt beliebige positive Ganzzahlen", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 365);

		expect(task.repeat).toBe(365);
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

describe("Task repeat ohne Datum", () => {
	it("verwirft ein im Konstruktor übergebenes repeat still, wenn kein Datum gesetzt ist", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", undefined, undefined, undefined, 7);

		expect(task.repeat).toBeUndefined();
	});

	it("wirft dabei nicht – ein bedeutungsloses repeat soll das Anlegen nicht scheitern lassen", () => {
		expect(() => new Task("Titel", "Beschreibung", "project-id", undefined, "10:00", undefined, 7)).not.toThrow();
	});

	it("verwirft ein per Setter gesetztes repeat, solange kein Datum gesetzt ist", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");

		task.repeat = 7;

		expect(task.repeat).toBeUndefined();
	});

	it("übernimmt repeat, sobald zuerst ein Datum gesetzt wurde", () => {
		const task = new Task("Titel", "Beschreibung", "project-id");

		task.date = "2099-01-01";
		task.repeat = 7;

		expect(task.repeat).toBe(7);
	});

	it("entfernt ein vorhandenes repeat, wenn das Datum wieder gelöscht wird", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 7);

		task.date = undefined;

		expect(task.repeat).toBeUndefined();
	});
});

describe("Task.isInPast", () => {
	it("ist false ohne Datum und ohne Uhrzeit", () => {
		expect(Task.isInPast(undefined, undefined)).toBe(false);
	});

	it("ist false für den heutigen Tag ohne Uhrzeit", () => {
		expect(Task.isInPast(today(), undefined)).toBe(false);
	});

	it("ist true für ein vergangenes Datum", () => {
		expect(Task.isInPast("2000-01-01", undefined)).toBe(true);
	});

	it("ist false für ein zukünftiges Datum", () => {
		expect(Task.isInPast("2099-01-01", "10:00")).toBe(false);
	});
});

describe("Task.nextOccurrence", () => {
	it("gibt undefined zurück, wenn kein repeat gesetzt ist", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01");

		expect(task.nextOccurrence()).toBeUndefined();
	});

	it("gibt undefined zurück, wenn repeat 0 ist (fachlich: keine Wiederholung)", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 0);

		expect(task.nextOccurrence()).toBeUndefined();
	});

	it("schiebt das Datum um repeat Tage weiter", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 7);

		expect(task.nextOccurrence()?.date).toBe("2099-01-08");
	});

	it("rechnet über Monatsgrenzen hinweg korrekt", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-28", undefined, undefined, 5);

		expect(task.nextOccurrence()?.date).toBe("2099-02-02");
	});

	it("übernimmt Titel, Beschreibung, Projekt, Uhrzeit, Dauer und dasselbe repeat", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", "10:00", 90, 7);

		const next = task.nextOccurrence();

		expect(next?.title).toBe("Titel");
		expect(next?.Description).toBe("Beschreibung");
		expect(next?.projectId).toBe("project-id");
		expect(next?.time).toBe("10:00");
		expect(next?.duration).toBe(90);
		expect(next?.repeat).toBe(7);
	});

	it("vergibt eine neue ID, statt die der abgehakten Aufgabe zu übernehmen", () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 7);

		expect(task.nextOccurrence()?.id).not.toBe(task.id);
	});

	it("schiebt so oft weiter, bis das Datum nicht mehr in der Vergangenheit liegt", () => {
		const longPast = new Task("Titel", "Beschreibung", "project-id", "2000-01-01", undefined, undefined, 7);

		const next = longPast.nextOccurrence();

		expect(Task.isInPast(next?.date, next?.time)).toBe(false);
	});

	it("erhält dabei den Rhythmus – der Abstand zum Ursprungsdatum bleibt ein Vielfaches von repeat", () => {
		const longPast = new Task("Titel", "Beschreibung", "project-id", "2000-01-01", undefined, undefined, 7);

		const next = longPast.nextOccurrence();
		const daysBetween = Math.round(
			(new Date(`${next?.date}T00:00:00`).getTime() - new Date("2000-01-01T00:00:00").getTime()) / 86_400_000,
		);

		expect(daysBetween % 7).toBe(0);
	});

	it("erzeugt eine Folgeaufgabe, die assertNotInPast besteht", () => {
		const longPast = new Task("Titel", "Beschreibung", "project-id", "2000-01-01", "10:00", undefined, 3);

		const next = longPast.nextOccurrence();

		expect(() => Task.assertNotInPast(next?.date, next?.time)).not.toThrow();
	});
});
