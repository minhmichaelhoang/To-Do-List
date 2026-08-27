import { describe, expect, it } from "vitest";
import { DeleteTask } from "../../src/Application/DeleteTask";
import { AddTask } from "../../src/Application/AddTask";
import { FindOrCreateProject } from "../../src/Application/FindOrCreateProject";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";

describe("DeleteTask", () => {
	it("entfernt einen vorhandenen Task", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const projectRepository = new InMemoryProjectRepository();
		const addTask = new AddTask(taskRepository, new FindOrCreateProject(projectRepository));
		const deleteTask = new DeleteTask(taskRepository);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt" });
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
