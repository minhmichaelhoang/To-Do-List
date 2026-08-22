import { TaskRepository } from "../ports/TaskRepository";
import { Task } from "../domain/Task";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `TaskRepository`
 * ohne echte Persistenz – Tasks leben nur im Array `tasks`, solange der
 * Prozess läuft. Ideal für Tests und den Walking Skeleton, da kein
 * Datenbank-Setup nötig ist. Methoden sind `async`, weil sie den Vertrag
 * des Ports erfüllen müssen (der auch vom asynchronen `PostgreTaskRepository`
 * implementiert wird), auch wenn hier intern kein `await` nötig ist.
 */
export class InMemoryTaskRepository implements TaskRepository {
	constructor(private readonly tasks: Task[] = []) {}

	async findByTitleContains(letters: string): Promise<Task[]> {
		return this.tasks.filter((task) => task.title.includes(letters));
	}

	async delete(id: string): Promise<void> {
		const index = this.tasks.findIndex((t) => t.id === id);
		if (index !== -1) {
			this.tasks.splice(index, 1);
		}
	}

	/** Gibt eine Kopie (`[...tasks]`) zurück, damit Aufrufer nicht versehentlich das interne Array mutieren. */
	async findAll(): Promise<Task[]> {
		return [...this.tasks];
	}

	async add(task: Task): Promise<void> {
		this.tasks.push(task);
	}
}
