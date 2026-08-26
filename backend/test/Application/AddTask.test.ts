import { describe, expect, it } from "vitest";
import { AddTask } from "../../src/Application/AddTask";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";

describe("AddTask", () => {
	it("speichert einen neuen Task mit den übergebenen Werten", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt" });

		const tasks = await taskRepository.findAll();
		expect(tasks).toHaveLength(1);
		expect(tasks[0].title).toBe("Titel");
		expect(tasks[0].Description).toBe("Beschreibung");
		expect(tasks[0].project).toBe("Projekt");
	});

	it("vergibt jedem Task eine eigene ID", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);

		await addTask.execute({ title: "Titel A", description: "Beschreibung", project: "Projekt" });
		await addTask.execute({ title: "Titel B", description: "Beschreibung", project: "Projekt" });

		const [taskA, taskB] = await taskRepository.findAll();
		expect(taskA.id).not.toBe(taskB.id);
	});

	it("übernimmt ein gesetztes Datum unverändert", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", date: "2099-01-01" });

		const [task] = await taskRepository.findAll();
		expect(task.date).toBe("2099-01-01");
	});

	it("setzt bei nur gesetzter Uhrzeit automatisch das heutige Datum", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);
		const now = new Date();
		const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", time: "23:59" });

		const [task] = await taskRepository.findAll();
		expect(task.date).toBe(today);
		expect(task.time).toBe("23:59");
	});

	it("lehnt ein Datum in der Vergangenheit ab", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);

		await expect(
			addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", date: "2000-01-01" }),
		).rejects.toThrow();
		expect(await taskRepository.findAll()).toHaveLength(0);
	});
});
