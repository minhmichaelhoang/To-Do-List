import { Router } from "express";
import { TaskDto } from "shared";
import { ListTasks } from "../Application/ListTasks";
import { AddTask } from "../Application/AddTask";
import {DeleteTask} from "../Application/DeleteTask";
import { EditTask } from "../Application/EditTask"
import { Task } from "../Domain/Task";
import { ProjectRepository } from "../Ports/ProjectRepository";

/**
 * Driving Adapter (Primary Adapter) für HTTP. Übersetzt eingehende
 * Requests (Methode + Pfad) in Aufrufe eines Use Cases und das Ergebnis
 * zurück in eine JSON-Response. Mappt `Task` explizit auf ein DTO
 * (`id`/`title`/`description`/eingebettetes `project`), statt die
 * Domain-Instanz direkt zu serialisieren – sonst würden die internen Felder
 * `_id`/`_title`/`_description` im JSON landen, da Getter keine eigenen
 * (enumerable own) Properties sind und von `JSON.stringify` ignoriert
 * werden. Braucht dafür zusätzlich `ProjectRepository`, um `projectId` zu
 * Name/Farbe aufzulösen.
 */
export function createTaskRouter(
	listTasks: ListTasks,
	addTask: AddTask,
	deleteTask: DeleteTask,
	editTask: EditTask,
	projectRepository: ProjectRepository,
): Router {
	const router = Router();

	async function toTaskDto(task: Task): Promise<TaskDto> {
		const project = await projectRepository.findById(task.projectId);
		if (!project) {
			throw new Error(`Projekt ${task.projectId} für Task ${task.id} nicht gefunden.`);
		}
		return {
			id: task.id,
			title: task.title,
			description: task.Description,
			project: { id: project.id, name: project.name, color: project.color },
			date: task.date,
			time: task.time,
			duration: task.duration,
		};
	}

	router.get("/tasks", async (_req, res) => {
		const tasks = await listTasks.execute();
		res.json(await Promise.all(tasks.map(toTaskDto)));
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
		const { title, description, project, date, time, duration } = req.body;
		try {
			await editTask.execute({ id, title, description, project, date, time, duration });
			res.status(204).send();
		} catch (error) {
			res.status(400).json({ message: error instanceof Error ? error.message : "Ungültige Eingabe" });
		}
	})

	return router;
}
