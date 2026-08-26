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
});
