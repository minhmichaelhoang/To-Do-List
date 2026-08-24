import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";

/**
 * Application Service / Use Case. Erzeugt aus rohen Eingabedaten eine neue
 * `Task`-Domain-Instanz (inkl. generierter ID) und speichert sie über den
 * Driven Port `TaskRepository`. Wird von Driving Adaptern (HTTP-Router,
 * CLI) aufgerufen, kennt selbst keine konkrete Adapter-Implementierung.
 */
export class AddTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(title: string, description: string, project:string): Promise<void> {
		const task = new Task(title, description, project);
		return this.taskRepository.add(task);
	}
}
