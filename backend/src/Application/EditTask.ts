import {TaskRepository} from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { FindOrCreateProject } from "./FindOrCreateProject";
import type { EditTaskDto } from "shared";

/**
 * Application Service / Use Case. Bearbeitet eine bestehende Aufgabe
 * (Titel/Beschreibung/Projekt) über den Driven Port `TaskRepository`.
 * Nimmt das `EditTaskDto` (inkl. `id`) entgegen, da anders als bei
 * `AddTask` bereits eine existierende ID vorliegt. `data.project` ist nur
 * der eingetippte Projektname – `FindOrCreateProject` löst ihn zur
 * `projectId` auf.
 */
export class EditTask {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly findOrCreateProject: FindOrCreateProject,
	) {}

	async execute(data: EditTaskDto): Promise<void> {
		const date = Task.resolveDate(data.date, data.time);
		Task.assertNotInPast(date, data.time);

		const project = await this.findOrCreateProject.execute(data.project);

		const task = new Task(data.title, data.description, project.id, date, data.time, data.duration, data.id);
		return this.taskRepository.edit(task);
	}
}
