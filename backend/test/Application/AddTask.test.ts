import { describe, expect, it } from "vitest";
import { AddTask } from "../../src/Application/AddTask";
import { FindOrCreateProject } from "../../src/Application/FindOrCreateProject";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";
import { today } from "shared";

function setup() {
	const taskRepository = new InMemoryTaskRepository();
	const projectRepository = new InMemoryProjectRepository();
	const addTask = new AddTask(taskRepository, new FindOrCreateProject(projectRepository));
	return { taskRepository, projectRepository, addTask };
}

describe("AddTask", () => {
	it("speichert einen neuen Task mit den übergebenen Werten", async () => {
		const { taskRepository, projectRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt" });

		const [task] = await taskRepository.findAll();
		const project = await projectRepository.findByName("Projekt");
		expect(task.title).toBe("Titel");
		expect(task.Description).toBe("Beschreibung");
		expect(task.projectId).toBe(project?.id);
	});

	it("vergibt jedem Task eine eigene ID", async () => {
		const { taskRepository, addTask } = setup();

		await addTask.execute({ title: "Titel A", description: "Beschreibung", project: "Projekt" });
		await addTask.execute({ title: "Titel B", description: "Beschreibung", project: "Projekt" });

		const [taskA, taskB] = await taskRepository.findAll();
		expect(taskA.id).not.toBe(taskB.id);
	});

	it("übernimmt ein gesetztes Datum unverändert", async () => {
		const { taskRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", date: "2099-01-01" });

		const [task] = await taskRepository.findAll();
		expect(task.date).toBe("2099-01-01");
	});

	it("setzt bei nur gesetzter Uhrzeit automatisch das heutige Datum", async () => {
		const { taskRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", time: "23:59" });

		const [task] = await taskRepository.findAll();
		expect(task.date).toBe(today());
		expect(task.time).toBe("23:59");
	});

	it("übernimmt eine gesetzte duration unverändert", async () => {
		const { taskRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", duration: 90 });

		const [task] = await taskRepository.findAll();
		expect(task.duration).toBe(90);
	});

	it("lehnt ein Datum in der Vergangenheit ab", async () => {
		const { taskRepository, addTask } = setup();

		await expect(
			addTask.execute({ title: "Titel", description: "Beschreibung", project: "Projekt", date: "2000-01-01" }),
		).rejects.toThrow();
		expect(await taskRepository.findAll()).toHaveLength(0);
	});

	it("lehnt einen Titel mit mehr als 50 Zeichen ab", async () => {
		const { taskRepository, addTask } = setup();

		await expect(
			addTask.execute({ title: "a".repeat(51), description: "Beschreibung", project: "Projekt" }),
		).rejects.toThrow();
		expect(await taskRepository.findAll()).toHaveLength(0);
	});

	it("legt ein neues Projekt an, wenn der Name noch nicht existiert", async () => {
		const { projectRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung", project: "Neues Projekt" });

		const project = await projectRepository.findByName("Neues Projekt");
		expect(project).toBeDefined();
	});

	it("wiederverwendet ein bereits existierendes Projekt statt es doppelt anzulegen", async () => {
		const { projectRepository, addTask } = setup();

		await addTask.execute({ title: "Titel A", description: "Beschreibung", project: "Projekt" });
		await addTask.execute({ title: "Titel B", description: "Beschreibung", project: "Projekt" });

		const projects = await projectRepository.findAll();
		expect(projects.filter((p) => p.name === "Projekt")).toHaveLength(1);
	});

	it("ordnet einen Task ohne Projektangabe automatisch \"Inbox\" zu", async () => {
		const { taskRepository, projectRepository, addTask } = setup();

		await addTask.execute({ title: "Titel", description: "Beschreibung" });

		const [task] = await taskRepository.findAll();
		const inbox = await projectRepository.findByName("Inbox");
		expect(task.projectId).toBe(inbox?.id);
	});
});
