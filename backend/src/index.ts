/**
 * Composition Root + Driving Adapter für die CLI-Variante. Verdrahtet
 * dieselben Bausteine wie `server.ts` (nur ohne HTTP), gibt das Ergebnis
 * von `ListTasks` direkt auf der Konsole aus.
 */
import { Task } from "./Domain/Task";
import { InMemoryTaskRepository } from "./Adapter/InMemoryTaskRepository";
import { ListTasks } from "./Application/ListTasks";
import { AddTask } from "./Application/AddTask";

async function main() {
	const taskRepository = new InMemoryTaskRepository([
		new Task("Hausaufgaben machen", "Mathe Seite 3, Aufgabe 4", "Schule"),
		new Task("Einkaufen", "Milch, Brot, Eier", "Alltag"),
	]);

	const listTasks = new ListTasks(taskRepository);

	const tasks = await listTasks.execute();

	tasks.forEach((task) => {
		console.log(`- ${task.title}: ${task.Description}`);
	});

	const addTask = new AddTask(taskRepository);
	await addTask.execute("Zähne putzen", "Mindestens 3 Minuten", "Alltag");

	// ist immer ein Snapshot
	const tasks2 = await listTasks.execute();

	console.log("Task added.");
	// Wird hier formatiert
	tasks2.forEach((task) => {
		console.log(`- ${task.title}: ${task.Description}`);
	});
}

main();
