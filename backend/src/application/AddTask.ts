import { TaskRepository } from "../ports/TaskRepository";
import { Task } from "../domain/Task";

export class AddTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(title: string, description: string): Promise<void> {
		const task = new Task(title, description);
		return this.taskRepository.add(task);
	}
}
