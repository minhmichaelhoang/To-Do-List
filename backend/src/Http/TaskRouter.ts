import { Router } from "express";
import { TaskDto } from "shared";
import { ListTasks } from "../Application/ListTasks";
import { AddTask } from "../Application/AddTask";
import {DeleteTask} from "../Application/DeleteTask";
import { EditTask } from "../Application/EditTask"

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
	deleteTask: DeleteTask,
	editTask: EditTask
): Router {
	const router = Router();

	router.get("/tasks", async (_req, res) => {
		const tasks = await listTasks.execute();
		res.json(
			tasks.map((task): TaskDto => ({
				id: task.id,
				title: task.title,
				description: task.Description,
				project: task.project,
				date: task.date,
				time: task.time,
			})),
		);
	});

	router.post("/tasks", async (req, res) => {
		try {
			await addTask.execute(req.body);
			res.status(201).send();
		} catch (error) {
			res.status(400).json({ message: error instanceof Error ? error.message : "Ungültige Eingabe" });
		}
	});

	router.delete("/tasks/:id", async (req, res) => {
		const { id } = req.params;
		await deleteTask.execute(id);
		res.status(204).send();
	})

	router.put("/tasks/:id", async (req, res) => {
		const { id } = req.params;
		const { title, description, project, date, time } = req.body;
		try {
			await editTask.execute({ id, title, description, project, date, time });
			res.status(204).send();
		} catch (error) {
			res.status(400).json({ message: error instanceof Error ? error.message : "Ungültige Eingabe" });
		}
	})

	return router;
}
