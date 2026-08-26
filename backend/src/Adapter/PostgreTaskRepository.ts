import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { Pool } from "pg";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `TaskRepository` gegen
 * eine echte Postgres-Datenbank über den `pg`-Pool. Erwartet eine Tabelle
 * `task (id, title, description, project, date, time)`. Alle Queries sind parametrisiert
 * (`$1`, `$2`, ...), um SQL-Injection zu verhindern.
 */
class PostgreTaskRepository implements TaskRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " + "FROM task " + "ORDER BY title ASC;",
		);
		return result.rows.map(
			(row) => new Task(row.title, row.description, row.project, row.date, row.time, row.id),
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
			(row) => new Task(row.title, row.description, row.project, row.date, row.time, row.id),
		);
	}

	async add(task: Task): Promise<void> {
		await this.pool.query(
			"INSERT INTO task (id, title, description, project, date, time) " + "VALUES ($1, $2, $3, $4, $5, $6);",
			[task.id, task.title, task.Description, task.project, task.date, task.time],
		);
	}

	async delete(id: string): Promise<void> {
		await this.pool.query("DELETE FROM task " + "WHERE id = $1;", [id]);
	}

	async edit(task: Task): Promise<void> {
		await this.pool.query(
			"UPDATE task SET title = $1, description = $2, project = $3, date = $4, time = $5 " + "WHERE id = $6;",
			[task.title, task.Description, task.project, task.date, task.time, task.id],
		);
	}
}
