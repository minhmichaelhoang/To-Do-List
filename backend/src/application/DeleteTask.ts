import {TaskRepository} from "../ports/TaskRepository";

/**
 * Application Service / Use Case. Löscht einen Task anhand seiner ID über
 * den Driven Port `TaskRepository`. Enthält keine Fachlogik – reicht die
 * ID nur an den konkreten Adapter (InMemory/Postgres) durch.
 */
export class DeleteTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(id: string): Promise<void> {
		return this.taskRepository.delete(id)
	}
}
