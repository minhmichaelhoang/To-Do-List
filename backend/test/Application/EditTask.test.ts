import { describe, expect, it } from "vitest";
import { EditTask } from "../../src/Application/EditTask";
import { AddTask } from "../../src/Application/AddTask";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";

describe("EditTask", () => {
	it("überschreibt Titel, Beschreibung und Projekt eines vorhandenen Tasks", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const addTask = new AddTask(taskRepository);
		const editTask = new EditTask(taskRepository);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt" });
		const [task] = await taskRepository.findAll();

		await editTask.execute({
			id: task.id,
			title: "Neuer Titel",
			description: "Neue Beschreibung",
			project: "Neues Projekt",
		});

		const [updated] = await taskRepository.findAll();
		expect(updated.id).toBe(task.id);
		expect(updated.title).toBe("Neuer Titel");
		expect(updated.Description).toBe("Neue Beschreibung");
		expect(updated.project).toBe("Neues Projekt");
	});
});
