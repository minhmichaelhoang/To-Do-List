import {TaskRepository} from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import type { TaskDto } from "shared";

/**
 * Application Service / Use Case. Bearbeitet eine bestehende Aufgabe
 * (Titel/Beschreibung/Projekt) über den Driven Port `TaskRepository`.
 * Nimmt das vollständige `TaskDto` (inkl. `id`) entgegen, da anders als bei
 * `AddTask` bereits eine existierende ID vorliegt.
 */
export class EditTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(data: TaskDto): Promise<void> {
		const task = new Task(data.title, data.description, data.project, data.id);
		return this.taskRepository.edit(task);
	}
}
