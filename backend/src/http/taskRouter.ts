import { Router } from "express";
import { TaskDto } from "shared";
import { ListTasks } from "../application/ListTasks";
import { AddTask } from "../application/AddTask";

/**
 * Driving Adapter (Primary Adapter) für HTTP. Übersetzt eingehende
 * Requests (Methode + Pfad) in Aufrufe eines Use Cases und das Ergebnis
 * zurück in eine JSON-Response. Mappt `Task` explizit auf ein DTO
 * (`id`/`title`/`description`), statt die Domain-Instanz direkt zu
 * serialisieren – sonst würden die internen Felder `_id`/`_title`/
 * `_description` im JSON landen, da Getter keine eigenen (enumerable own)
 * Properties sind und von `JSON.stringify` ignoriert werden.
 */
export function createTaskRouter(
	listTasks: ListTasks,
	addTask: AddTask,
	deleteTask: DeleteTask
): Router {
	const router = Router();

	router.get("/tasks", async (req, res) => {
		const tasks = await listTasks.execute();
		res.json(
			tasks.map((task): TaskDto => ({
				id: task.id,
				title: task.title,
				description: task.Description,
				project: task.project
			})),
		);
	});

	router.post("/tasks", async (req, res) => {
		const { title, description } = req.body;
		await addTask.execute(title, description);
		res.status(201).send();
	});

	return router;
}
