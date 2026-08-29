import { afterEach, describe, expect, it, vi } from "vitest";
import { createTask, deleteTask, getTasks, updateTask } from "../../../../src/features/tasks/api/TaskApi";

afterEach(() => {
	vi.unstubAllGlobals();
});

const task = { id: "abc-123", title: "Titel", description: "Beschreibung", project: "Projekt" };

describe("TaskApi", () => {
	it("getTasks lädt die Task-Liste per GET", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [task] });
		vi.stubGlobal("fetch", fetchMock);

		expect(await getTasks()).toEqual([task]);
		expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/tasks");
	});

	it("getTasks wirft bei einem fehlgeschlagenen Request", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

		await expect(getTasks()).rejects.toThrow(/Status 500/);
	});

	it("createTask schickt POST mit dem übergebenen Body", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
		vi.stubGlobal("fetch", fetchMock);

		await createTask({ title: "Titel", description: "Beschreibung", project: "Projekt" });

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks",
			expect.objectContaining({ method: "POST" }),
		);
	});

	it("createTask wirft mit der Backend-Fehlermeldung, wenn vorhanden", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: "Datum in der Vergangenheit" }) }),
		);

		await expect(createTask({ title: "Titel", description: "Beschreibung", project: "Projekt" })).rejects.toThrow(
			"Datum in der Vergangenheit",
		);
	});

	it("createTask nutzt die Standardmeldung, wenn der Body keine message hat", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
		);

		await expect(createTask({ title: "Titel", description: "Beschreibung", project: "Projekt" })).rejects.toThrow(
			/Status 500/,
		);
	});

	it("updateTask schickt PUT an die Task-ID", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
		vi.stubGlobal("fetch", fetchMock);

		await updateTask(task);

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "PUT" }),
		);
	});

	it("deleteTask schickt DELETE an die Task-ID", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
		vi.stubGlobal("fetch", fetchMock);

		await deleteTask("abc-123");

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "DELETE" }),
		);
	});
});
