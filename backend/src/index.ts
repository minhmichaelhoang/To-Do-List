/**
 * Composition Root + Driving Adapter für die CLI-Variante. Verdrahtet
 * dieselben Bausteine wie `Server.ts` (nur ohne HTTP), gibt das Ergebnis
 * von `ListTasks` direkt auf der Konsole aus.
 */
import { Task } from "./Domain/Task";
import { Project } from "./Domain/Project";
import { InMemoryTaskRepository } from "./Adapter/InMemoryTaskRepository";
import { InMemoryProjectRepository } from "./Adapter/InMemoryProjectRepository";
import { ListTasks } from "./Application/ListTasks";
import { AddTask } from "./Application/AddTask";
import { FindOrCreateProject } from "./Application/FindOrCreateProject";

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

	const listTasks = new ListTasks(taskRepository);

	const tasks = await listTasks.execute();

	tasks.forEach((task) => {
		console.log(`- ${task.title}: ${task.Description}`);
	});

	const findOrCreateProject = new FindOrCreateProject(projectRepository);
	const addTask = new AddTask(taskRepository, findOrCreateProject);
	await addTask.execute({ title: "Zähne putzen", description: "Mindestens 3 Minuten", project: "Alltag" });

	// ist immer ein Snapshot
	const tasks2 = await listTasks.execute();

	console.log("Task added.");
	// Wird hier formatiert
	tasks2.forEach((task) => {
		console.log(`- ${task.title}: ${task.Description}`);
	});
}

main();
