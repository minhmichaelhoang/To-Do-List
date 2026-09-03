import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createTaskRouter } from "../../src/Http/TaskRouter";
import { ListTasks } from "../../src/Application/ListTasks";
import { AddTask } from "../../src/Application/AddTask";
import { DeleteTask } from "../../src/Application/DeleteTask";
import { EditTask } from "../../src/Application/EditTask";
import { CompleteTask } from "../../src/Application/CompleteTask";
import { FindOrCreateProject } from "../../src/Application/FindOrCreateProject";
import { InMemoryTaskRepository } from "../../src/Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";
import { Task } from "../../src/Domain/Task";
import type { TaskDto } from "shared";

/**
 * Testet den Driving Adapter über echtes HTTP statt nur die Use Cases: nur
 * hier fällt auf, wenn eine Route gar nicht registriert ist (404), was den
 * Use-Case-Tests naturgemäß entgeht.
 */
const taskRepository = new InMemoryTaskRepository();
const projectRepository = new InMemoryProjectRepository();
let server: Server;
let baseUrl: string;

beforeAll(async () => {
	const findOrCreateProject = new FindOrCreateProject(projectRepository);
	const app = express();
	app.use(express.json());
	app.use(
		createTaskRouter(
			new ListTasks(taskRepository),
			new AddTask(taskRepository, findOrCreateProject),
			new DeleteTask(taskRepository),
			new EditTask(taskRepository, findOrCreateProject),
			new CompleteTask(taskRepository),
			projectRepository,
		),
	);

	server = createServer(app);
	await new Promise<void>((resolve) => server.listen(0, resolve));
	baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
	await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function listTasks(): Promise<TaskDto[]> {
	const response = await fetch(`${baseUrl}/tasks`);
	return response.json();
}

describe("POST /tasks/:id/complete", () => {
	it("ist registriert und antwortet mit 204 statt 404", async () => {
		await fetch(`${baseUrl}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "Einmalig", description: "", project: "Projekt", date: "2099-01-01" }),
		});
		const [task] = await listTasks();

		const response = await fetch(`${baseUrl}/tasks/${task.id}/complete`, { method: "POST" });

		expect(response.status).toBe(204);
		expect(await listTasks()).toHaveLength(0);
	});

	it("ersetzt eine Aufgabe mit repeat durch die Folgeaufgabe", async () => {
		await fetch(`${baseUrl}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "Wiederkehrend", description: "", project: "Projekt", date: "2099-01-01", time: "10:00", repeat: 7 }),
		});
		const [task] = await listTasks();

		const response = await fetch(`${baseUrl}/tasks/${task.id}/complete`, { method: "POST" });

		expect(response.status).toBe(204);
		const remaining = await listTasks();
		expect(remaining).toHaveLength(1);
		expect(remaining[0].id).not.toBe(task.id);
		expect(remaining[0].date).toBe("2099-01-08");
		expect(remaining[0].time).toBe("10:00");
		expect(remaining[0].repeat).toBe(7);

		await fetch(`${baseUrl}/tasks/${remaining[0].id}`, { method: "DELETE" });
	});

	it("antwortet auch für eine unbekannte ID mit 204, nicht mit 404", async () => {
		const response = await fetch(`${baseUrl}/tasks/unbekannte-id/complete`, { method: "POST" });

		expect(response.status).toBe(204);
	});

	it("verwirft ein repeat ohne Datum, legt den Task aber an", async () => {
		await fetch(`${baseUrl}/tasks`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: "Ohne Datum", description: "", project: "Projekt", repeat: 7 }),
		});

		const [task] = await listTasks();
		expect(task.repeat).toBeUndefined();

		await fetch(`${baseUrl}/tasks/${task.id}`, { method: "DELETE" });
	});
});

describe("Task-Routen allgemein", () => {
	it("liefert 404 für einen Pfad, den es nicht gibt", async () => {
		const response = await fetch(`${baseUrl}/tasks/irgendeine-id/erledigt`, { method: "POST" });

		expect(response.status).toBe(404);
	});
});
