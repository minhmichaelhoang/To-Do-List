import { describe, expect, it } from "vitest";
import { ListTasks } from "../../src/Application/ListTasks";
import { Task } from "../../src/Domain/Task";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";

describe("ListTasks", () => {
	it("gibt alle im Repository gespeicherten Tasks zurück", async () => {
		const taskRepository = new InMemoryTaskRepository([
			new Task("Titel A", "Beschreibung A", "Projekt A"),
			new Task("Titel B", "Beschreibung B", "Projekt B"),
		]);
		const listTasks = new ListTasks(taskRepository);

		const tasks = await listTasks.execute();

		expect(tasks).toHaveLength(2);
		expect(tasks.map((task) => task.title)).toEqual(["Titel A", "Titel B"]);
	});

	it("gibt ein leeres Array zurück, wenn keine Tasks vorhanden sind", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const listTasks = new ListTasks(taskRepository);

		expect(await listTasks.execute()).toEqual([]);
	});
});
