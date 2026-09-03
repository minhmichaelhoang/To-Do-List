import { Task } from "../Domain/Task";

/**
 * Driven Port (Secondary Port). Von der Application-Schicht definierter
 * Vertrag für Persistenz – die Application kennt nur dieses Interface,
 * nie eine konkrete Datenquelle. Wird von den Driven Adaptern
 * `InMemoryTaskRepository` und `PostgreTaskRepository` implementiert.
 */
export interface TaskRepository {
	findAll(): Promise<Task[]>;
	/** Liefert `undefined`, wenn es keinen Task mit dieser ID gibt – Aufrufer entscheiden selbst, ob das ein Fehler ist. */
	findById(id: string): Promise<Task | undefined>;
	findByTitleContains(letters: string): Promise<Task[]>; // noch nicht in Verwendung
	add(task: Task): Promise<void>;
	delete(id: string): Promise<void>;
	edit(task: Task): Promise<void>;
}
