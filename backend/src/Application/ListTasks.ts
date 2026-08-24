import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";

/**
 * Application Service / Use Case. Orchestriert den Ablauf für "alle Tasks
 * auflisten": ruft den Driven Port `TaskRepository` auf, ohne dessen
 * konkrete Implementierung (InMemory vs. Postgres) zu kennen. Wird von
 * Driving Adaptern (CLI in `index.ts`, HTTP-Router in `taskRouter.ts`)
 * aufgerufen. Enthält bewusst keine eigene Fachlogik – die liegt in `Task`.
 */
export class ListTasks {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(): Promise<Task[]> {
		return this.taskRepository.findAll();
	}
}
