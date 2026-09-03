/**
 * Composition Root für die HTTP-Variante. Verdrahtet konkrete Adapter mit
 * Use Cases (Dependency Injection von Hand) und startet den Express-Server.
 * Einziger Ort im Projekt, der sowohl die Driven-Adapter-Implementierung
 * (`InMemory*`/`Postgre*`) als auch die Driving Adapter (`TaskRouter`/
 * `ProjectRouter`) kennt – Domain, Ports und Use Cases bleiben davon
 * unberührt. Persistenz wird zur Laufzeit gewählt: ist `DATABASE_URL`
 * gesetzt, laufen die Postgres-Adapter gegen diese Datenbank (Schema siehe
 * `db/schema.sql`); sonst die In-Memory-Adapter mit fester Seed-Daten, wie
 * bisher für die lokale Entwicklung ohne DB-Setup.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { Task } from "./Domain/Task";
import { Project } from "./Domain/Project";
import { TaskRepository } from "./Ports/TaskRepository";
import { ProjectRepository } from "./Ports/ProjectRepository";
import { InMemoryTaskRepository } from "./Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "./Adapter/InMemoryProjectRepository";
import { PostgreTaskRepository } from "./Adapter/PostgreTaskRepository";
import { PostgreProjectRepository } from "./Adapter/PostgreProjectRepository";
import { ListTasks } from "./Application/ListTasks";
import { ListProjects } from "./Application/ListProjects";
import { AddTask } from "./Application/AddTask";
import { FindOrCreateProject } from "./Application/FindOrCreateProject";
import { createTaskRouter } from "./Http/TaskRouter";
import { createProjectRouter } from "./Http/ProjectRouter";
import {DeleteTask} from "./Application/DeleteTask";
import {EditTask} from "./Application/EditTask";
import {CompleteTask} from "./Application/CompleteTask";

async function createRepositories(): Promise<{ taskRepository: TaskRepository; projectRepository: ProjectRepository }> {
	if (process.env.DATABASE_URL) {
		const pool = new Pool({ connectionString: process.env.DATABASE_URL });
		console.log("Persistenz: Postgres (DATABASE_URL gesetzt)");
		return {
			taskRepository: new PostgreTaskRepository(pool),
			projectRepository: new PostgreProjectRepository(pool),
		};
	}

	const projectRepository = new InMemoryProjectRepository();
	const schule = new Project("Schule");
	const alltag = new Project("Alltag", "#074e6a");
	const privat = new Project("Privat", "#d5d0ba");
	await projectRepository.add(schule);
	await projectRepository.add(alltag);
	await projectRepository.add(privat);

	const taskRepository = new InMemoryTaskRepository([
		new Task("Hausaufgaben machen", "Mathe Seite 3, Aufgabe 4", schule.id),
		new Task("Einkaufen", "Milch, Brot, Eier", alltag.id),
		new Task("Wäsche waschen", "Nur Buntwäsche waschen", privat.id),
	]);

	console.log("Persistenz: In-Memory (keine DATABASE_URL gesetzt)");
	return { taskRepository, projectRepository };
}

async function main() {
	const { taskRepository, projectRepository } = await createRepositories();

	const findOrCreateProject = new FindOrCreateProject(projectRepository);
	const listTasks = new ListTasks(taskRepository);
	const listProjects = new ListProjects(projectRepository);
	const addTask = new AddTask(taskRepository, findOrCreateProject);
	const deleteTask = new DeleteTask(taskRepository);
	const editTask = new EditTask(taskRepository, findOrCreateProject);
	const completeTask = new CompleteTask(taskRepository);

	const app = express();
	app.use(cors()); // erlaubt Requests vom Vite-Dev-Server (andere Origin: Port 5173 statt 3000)
	app.use(express.json()); // parst JSON-Request-Bodies nach req.body (für POST /tasks nötig)

	// Health-Check für die nackte Root-URL – ohne diese Route antwortet Express dort mit
	// 404, was z.B. Flys automatische Deploy-Prüfung sowie zufällige Aufrufe der Basis-URL fälschlich als Fehler meldet.
	app.get("/", (_req, res) => {
		res.json({ status: "ok" });
	});

	app.use(createTaskRouter(listTasks, addTask, deleteTask, editTask, completeTask, projectRepository));
	app.use(createProjectRouter(listProjects));

	const port = process.env.PORT ? Number(process.env.PORT) : 3000;
	app.listen(port, () => {
		console.log(`Server läuft auf http://localhost:${port}`);
	});
}

main();
