import { Task } from "../Domain/Task";

/**
 * Driven Port (Secondary Port). Von der Application-Schicht definierter
 * Vertrag für Persistenz – die Application kennt nur dieses Interface,
 * nie eine konkrete Datenquelle. Wird von den Driven Adaptern
 * `InMemoryTaskRepository` und `PostgreTaskRepository` implementiert.
 */
export interface TaskRepository {
	findAll(): Promise<Task[]>;
	findByTitleContains(letters: string): Promise<Task[]>; // noch nicht in Verwendung
	add(task: Task): Promise<void>;
	delete(id: string): Promise<void>;
	edit(task: Task): Promise<void>;
}
