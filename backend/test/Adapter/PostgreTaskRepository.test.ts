import { describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";
import { PostgreTaskRepository } from "../../src/Adapter/PostgreTaskRepository";

/**
 * Deckt die Übersetzung zwischen Datenbank- und Domain-Darstellung ab. Die
 * In-Memory-Tests können das nicht: dort landen nie `null`-Werte in einem
 * Task, weil sie gar nicht durch eine Datenbank gehen.
 */
function poolReturning(rows: unknown[]): Pool {
	return { query: vi.fn().mockResolvedValue({ rows }) } as unknown as Pool;
}

const rowWithNulls = {
	id: "task-id",
	title: "Titel",
	description: "Beschreibung",
	project_id: "project-id",
	date: null,
	time: null,
	duration: null,
	repeat: null,
};

describe("PostgreTaskRepository: NULL-Spalten", () => {
	it("übersetzt NULL-Spalten zu undefined, statt am Konstruktor zu scheitern", async () => {
		const repository = new PostgreTaskRepository(poolReturning([rowWithNulls]));

		const [task] = await repository.findAll();

		expect(task.date).toBeUndefined();
		expect(task.time).toBeUndefined();
		expect(task.duration).toBeUndefined();
		expect(task.repeat).toBeUndefined();
	});

	it("lädt eine Altzeile ohne repeat, ohne zu werfen", async () => {
		const repository = new PostgreTaskRepository(poolReturning([rowWithNulls]));

		await expect(repository.findAll()).resolves.toHaveLength(1);
	});

	it("übersetzt NULL auch in findById", async () => {
		const repository = new PostgreTaskRepository(poolReturning([rowWithNulls]));

		const task = await repository.findById("task-id");

		expect(task?.repeat).toBeUndefined();
	});

	it("gibt undefined zurück, wenn findById keine Zeile findet", async () => {
		const repository = new PostgreTaskRepository(poolReturning([]));

		expect(await repository.findById("fehlt")).toBeUndefined();
	});

	it("reicht gesetzte Werte unverändert durch", async () => {
		const repository = new PostgreTaskRepository(
			poolReturning([{ ...rowWithNulls, date: "2099-01-01", time: "10:00", duration: 90, repeat: 7 }]),
		);

		const [task] = await repository.findAll();

		expect(task.date).toBe("2099-01-01");
		expect(task.time).toBe("10:00");
		expect(task.duration).toBe(90);
		expect(task.repeat).toBe(7);
	});
});
