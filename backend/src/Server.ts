/**
 * Composition Root für die HTTP-Variante. Verdrahtet konkrete Adapter mit
 * Use Cases (Dependency Injection von Hand) und startet den Express-Server.
 * Einziger Ort im Projekt, der sowohl die Driven-Adapter-Implementierung
 * (`InMemoryTaskRepository`) als auch den Driving Adapter (`taskRouter`)
 * kennt – Domain, Ports und Use Cases bleiben davon unberührt.
 */
import express from "express";
import cors from "cors";
import { Task } from "./domain/Task";
import { InMemoryTaskRepository } from "./Adapter/InMemoryTaskRepository";
import { ListTasks } from "./application/ListTasks";
import { AddTask } from "./application/AddTask";
import { createTaskRouter } from "./http/TaskRouter";


const taskRepository = new InMemoryTaskRepository([
	new Task("Hausaufgaben machen", "Mathe Seite 3, Aufgabe 4"),
	new Task("Einkaufen", "Milch, Brot, Eier"),
]);

const listTasks = new ListTasks(taskRepository);
const addTask = new AddTask(taskRepository);

const app = express();
app.use(cors()); // erlaubt Requests vom Vite-Dev-Server (andere Origin: Port 5173 statt 3000)
app.use(express.json()); // parst JSON-Request-Bodies nach req.body (für POST /tasks nötig)
app.use(createTaskRouter(listTasks, addTask));

const port = 3000;
app.listen(port, () => {
	console.log(`Server läuft auf http://localhost:${port}`);
});
