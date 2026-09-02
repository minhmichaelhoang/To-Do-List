import { describe, expect, it } from "vitest";
import { EditTask } from "../../src/Application/EditTask";
import { AddTask } from "../../src/Application/AddTask";
import { FindOrCreateProject } from "../../src/Application/FindOrCreateProject";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";

describe("EditTask", () => {
	it("überschreibt Titel, Beschreibung und Projekt eines vorhandenen Tasks", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);
		const addTask = new AddTask(taskRepository, findOrCreateProject);
		const editTask = new EditTask(taskRepository, findOrCreateProject);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt" });
		const [task] = await taskRepository.findAll();

		await editTask.execute({
			id: task.id,
			title: "Neuer Titel",
			description: "Neue Beschreibung",
			project: "Neues Projekt",
		});

		const [updated] = await taskRepository.findAll();
		const neuesProjekt = await projectRepository.findByName("Neues Projekt");
		expect(updated.id).toBe(task.id);
		expect(updated.title).toBe("Neuer Titel");
		expect(updated.Description).toBe("Neue Beschreibung");
		expect(updated.projectId).toBe(neuesProjekt?.id);
	});

	it("überschreibt duration eines vorhandenen Tasks", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);
		const addTask = new AddTask(taskRepository, findOrCreateProject);
		const editTask = new EditTask(taskRepository, findOrCreateProject);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", duration: 30 });
		const [task] = await taskRepository.findAll();

		await editTask.execute({
			id: task.id,
			title: "Titel",
			description: "Beschreibung",
			project: "Projekt",
			duration: 120,
		});

		const [updated] = await taskRepository.findAll();
		expect(updated.duration).toBe(120);
	});

	it("überschreibt repeat eines vorhandenen Tasks", async () => {
		const taskRepository = new InMemoryTaskRepository();
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);
		const addTask = new AddTask(taskRepository, findOrCreateProject);
		const editTask = new EditTask(taskRepository, findOrCreateProject);

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", repeat: 3 });
		const [task] = await taskRepository.findAll();

		await editTask.execute({
			id: task.id,
			title: "Titel",
			description: "Beschreibung",
			project: "Projekt",
			repeat: 14,
		});

		const [updated] = await taskRepository.findAll();
		expect(updated.repeat).toBe(14);
	});
});
