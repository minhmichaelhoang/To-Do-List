import { describe, expect, it } from "vitest";
import { CompleteTask } from "../../src/Application/CompleteTask";
import { Task } from "../../src/Domain/Task";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";

function setup(tasks: Task[] = []) {
	const taskRepository = new InMemoryTaskRepository(tasks);
	return { taskRepository, completeTask: new CompleteTask(taskRepository) };
}

describe("CompleteTask", () => {
	it("entfernt einen Task ohne repeat ersatzlos", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01");
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		expect(await taskRepository.findAll()).toHaveLength(0);
	});

	it("entfernt einen Task mit repeat 0 ersatzlos (fachlich: keine Wiederholung)", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 0);
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		expect(await taskRepository.findAll()).toHaveLength(0);
	});

	it("ersetzt einen Task mit repeat durch genau eine Folgeaufgabe", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 7);
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		const remaining = await taskRepository.findAll();
		expect(remaining).toHaveLength(1);
		expect(remaining[0].id).not.toBe(task.id);
	});

	it("schiebt das Datum der Folgeaufgabe um repeat Tage weiter", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", undefined, undefined, 7);
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		const [next] = await taskRepository.findAll();
		expect(next.date).toBe("2099-01-08");
	});

	it("übernimmt die übrigen Eigenschaften inklusive repeat, damit die Kette weiterläuft", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2099-01-01", "10:00", 90, 7);
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		const [next] = await taskRepository.findAll();
		expect(next.title).toBe("Titel");
		expect(next.Description).toBe("Beschreibung");
		expect(next.projectId).toBe("project-id");
		expect(next.time).toBe("10:00");
		expect(next.duration).toBe(90);
		expect(next.repeat).toBe(7);
	});

	it("legt für einen überfälligen Task eine Folgeaufgabe an, die nicht in der Vergangenheit liegt", async () => {
		const task = new Task("Titel", "Beschreibung", "project-id", "2000-01-01", undefined, undefined, 7);
		const { taskRepository, completeTask } = setup([task]);

		await completeTask.execute(task.id);

		const [next] = await taskRepository.findAll();
		expect(Task.isInPast(next.date, next.time)).toBe(false);
	});

	it("wirft keinen Fehler, wenn die ID nicht existiert, und legt nichts an", async () => {
		const { taskRepository, completeTask } = setup();

		await expect(completeTask.execute("unbekannte-id")).resolves.toBeUndefined();
		expect(await taskRepository.findAll()).toHaveLength(0);
	});
});
