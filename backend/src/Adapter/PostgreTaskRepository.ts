import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { Pool } from "pg";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `TaskRepository` gegen
 * eine echte Postgres-Datenbank über den `pg`-Pool. Erwartet eine Tabelle
 * `task (id, title, description, project_id, date, time, duration)`. Alle Queries sind parametrisiert
 * (`$1`, `$2`, ...), um SQL-Injection zu verhindern.
 */
export class PostgreTaskRepository implements TaskRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " + "FROM task " + "ORDER BY title ASC;",
		);
		return result.rows.map(
			(row) => new Task(row.title, row.description, row.project_id, row.date, row.time, row.duration, row.id),
		);
	}

	async findByTitleContains(letters: string): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " +
				"FROM task " +
				"WHERE title ILIKE $1 " +
				"ORDER BY title ASC;",
			[`%${letters}%`],
		);
		return result.rows.map(
			(row) => new Task(row.title, row.description, row.project_id, row.date, row.time, row.duration, row.id),
		);
	}

	async add(task: Task): Promise<void> {
		await this.pool.query(
			"INSERT INTO task (id, title, description, project_id, date, time, duration) " + "VALUES ($1, $2, $3, $4, $5, $6, $7);",
			[task.id, task.title, task.Description, task.projectId, task.date, task.time, task.duration],
		);
	}

	async delete(id: string): Promise<void> {
		await this.pool.query("DELETE FROM task " + "WHERE id = $1;", [id]);
	}

	async edit(task: Task): Promise<void> {
		await this.pool.query(
			"UPDATE task SET title = $1, description = $2, project_id = $3, date = $4, time = $5, duration = $6 " + "WHERE id = $7;",
			[task.title, task.Description, task.projectId, task.date, task.time, task.duration, task.id],
		);
	}
}
