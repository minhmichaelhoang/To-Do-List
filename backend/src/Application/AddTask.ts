import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import type { CreateTaskDto } from "shared";

/**
 * Application Service / Use Case. Erzeugt aus rohen Eingabedaten eine neue
 * `Task`-Domain-Instanz (inkl. generierter ID) und speichert sie über den
 * Driven Port `TaskRepository`. Wird von Driving Adaptern (HTTP-Router,
 * CLI) aufgerufen, kennt selbst keine konkrete Adapter-Implementierung.
 * Nimmt ein `CreateTaskDto`-Objekt statt einzelner Parameter entgegen, um
 * Verwechslungen bei der Reihenfolge (title/description/project sind alle
 * `string`) auszuschließen.
 */
export class AddTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(data: CreateTaskDto): Promise<void> {
		const task = new Task(data.title, data.description, data.project);
		return this.taskRepository.add(task);
	}
}
