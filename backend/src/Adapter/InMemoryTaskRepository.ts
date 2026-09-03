import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";

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

	async findById(id: string): Promise<Task | undefined> {
		return this.tasks.find((task) => task.id === id);
	}

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

	async edit(task: Task): Promise<void> {
		const index = this.tasks.findIndex((t) => t.id === task.id);
		if (index !== -1) {
			this.tasks[index] = task;
		}
	}
}
