import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { FindOrCreateProject } from "./FindOrCreateProject";
import type { CreateTaskDto } from "shared";

/**
 * Application Service / Use Case. Erzeugt aus rohen Eingabedaten eine neue
 * `Task`-Domain-Instanz (inkl. generierter ID) und speichert sie über den
 * Driven Port `TaskRepository`. Wird von Driving Adaptern (HTTP-Router,
 * CLI) aufgerufen, kennt selbst keine konkrete Adapter-Implementierung.
 * Nimmt ein `CreateTaskDto`-Objekt statt einzelner Parameter entgegen, um
 * Verwechslungen bei der Reihenfolge (title/description sind beide
 * `string`) auszuschließen. `data.project` ist nur der eingetippte
 * Projektname – `FindOrCreateProject` löst ihn zur `projectId` auf.
 */
export class AddTask {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly findOrCreateProject: FindOrCreateProject,
	) {}

	async execute(data: CreateTaskDto): Promise<void> {
		const date = Task.resolveDate(data.date, data.time);
		Task.assertNotInPast(date, data.time);

		const project = await this.findOrCreateProject.execute(data.project);

		const task = new Task(data.title, data.description, project.id, date, data.time);
		return this.taskRepository.add(task);
	}
}
