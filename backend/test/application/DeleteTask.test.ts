import { describe, expect, it } from "vitest";
import { DeleteTask } from "../../src/application/DeleteTask";
import { AddTask } from "../../src/application/AddTask";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";

describe("DeleteTask", () => {
	it("entfernt einen vorhandenen Task", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);
		const deleteTask = new DeleteTask(taskRepository);

		await addTask.execute("Titel", "Beschreibung", "Projekt");
		const [task] = await taskRepository.findAll();

		await deleteTask.execute(task.id);

		expect(await taskRepository.findAll()).toHaveLength(0);
	});

	it("wirft keinen Fehler, wenn die ID nicht existiert", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const deleteTask = new DeleteTask(taskRepository);

		await expect(deleteTask.execute("unbekannte-id")).resolves.toBeUndefined();
	});
});
