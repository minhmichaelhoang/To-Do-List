/**
 * Composition Root für die HTTP-Variante. Verdrahtet konkrete Adapter mit
 * Use Cases (Dependency Injection von Hand) und startet den Express-Server.
 * Einziger Ort im Projekt, der sowohl die Driven-Adapter-Implementierung
 * (`InMemoryTaskRepository`/`InMemoryProjectRepository`) als auch die
 * Driving Adapter (`TaskRouter`/`ProjectRouter`) kennt – Domain, Ports und
 * Use Cases bleiben davon unberührt.
 */
import express from "express";
import cors from "cors";
import { Task } from "./Domain/Task";
import { Project } from "./Domain/Project";
import { InMemoryTaskRepository } from "./Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "./Adapter/InMemoryProjectRepository";
import { ListTasks } from "./Application/ListTasks";
import { ListProjects } from "./Application/ListProjects";
import { AddTask } from "./Application/AddTask";
import { FindOrCreateProject } from "./Application/FindOrCreateProject";
import { createTaskRouter } from "./Http/TaskRouter";
import { createProjectRouter } from "./Http/ProjectRouter";
import {DeleteTask} from "./Application/DeleteTask";
import {EditTask} from "./Application/EditTask";

async function main() {
	const projectRepository = new InMemoryProjectRepository();
	const schule = new Project("Schule");
	const alltag = new Project("Alltag");
	await projectRepository.add(schule);
	await projectRepository.add(alltag);

	const taskRepository = new InMemoryTaskRepository([
		new Task("Hausaufgaben machen", "Mathe Seite 3, Aufgabe 4", schule.id),
		new Task("Einkaufen", "Milch, Brot, Eier", alltag.id),
	]);

	const findOrCreateProject = new FindOrCreateProject(projectRepository);
	const listTasks = new ListTasks(taskRepository);
	const listProjects = new ListProjects(projectRepository);
	const addTask = new AddTask(taskRepository, findOrCreateProject);
	const deleteTask = new DeleteTask(taskRepository);
	const editTask = new EditTask(taskRepository, findOrCreateProject);

	const app = express();
	app.use(cors()); // erlaubt Requests vom Vite-Dev-Server (andere Origin: Port 5173 statt 3000)
	app.use(express.json()); // parst JSON-Request-Bodies nach req.body (für POST /tasks nötig)
	app.use(createTaskRouter(listTasks, addTask, deleteTask, editTask, projectRepository));
	app.use(createProjectRouter(listProjects));

	const port = 3000;
	app.listen(port, () => {
		console.log(`Server läuft auf http://localhost:${port}`);
	});
}

main();
