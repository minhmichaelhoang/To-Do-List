import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { Pool } from "pg";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `TaskRepository` gegen
 * eine echte Postgres-Datenbank über den `pg`-Pool. Erwartet eine Tabelle
 * `task (id, title, description, project_id, date, time, duration, repeat)`. Alle Queries sind parametrisiert
 * (`$1`, `$2`, ...), um SQL-Injection zu verhindern.
 */
export class PostgreTaskRepository implements TaskRepository {
	constructor(private readonly pool: Pool) {}

	/** Einziger Ort, der die Spalten-Reihenfolge des `Task`-Konstruktors kennt – sonst müsste jede neue Spalte in jeder Query-Methode einzeln nachgezogen werden. */
	private static toTask(row: any): Task {
		return new Task(row.title, row.description, row.project_id, row.date, row.time, row.duration, row.repeat, row.id);
	}

	async findAll(): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " + "FROM task " + "ORDER BY title ASC;",
		);
		return result.rows.map(PostgreTaskRepository.toTask);
	}

	async findById(id: string): Promise<Task | undefined> {
		const result = await this.pool.query(
			"SELECT * " + "FROM task " + "WHERE id = $1;",
			[id],
		);
		const row = result.rows[0];
		return row ? PostgreTaskRepository.toTask(row) : undefined;
	}

	async findByTitleContains(letters: string): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " +
				"FROM task " +
				"WHERE title ILIKE $1 " +
				"ORDER BY title ASC;",
			[`%${letters}%`],
		);
		return result.rows.map(PostgreTaskRepository.toTask);
	}

	async add(task: Task): Promise<void> {
		await this.pool.query(
			"INSERT INTO task (id, title, description, project_id, date, time, duration, repeat) " + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
			[task.id, task.title, task.Description, task.projectId, task.date, task.time, task.duration, task.repeat],
		);
	}

	async delete(id: string): Promise<void> {
		await this.pool.query("DELETE FROM task " + "WHERE id = $1;", [id]);
	}

	async edit(task: Task): Promise<void> {
		await this.pool.query(
			"UPDATE task SET title = $1, description = $2, project_id = $3, date = $4, time = $5, duration = $6, repeat = $7 " + "WHERE id = $8;",
			[task.title, task.Description, task.projectId, task.date, task.time, task.duration, task.repeat, task.id],
		);
	}
}
