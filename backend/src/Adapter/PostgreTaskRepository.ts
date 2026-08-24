import { TaskRepository } from "../Ports/TaskRepository";
import { Task } from "../Domain/Task";
import { Pool } from "pg";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `TaskRepository` gegen
 * eine echte Postgres-Datenbank über den `pg`-Pool. Erwartet eine Tabelle
 * `task (id, title, description)`. Alle Queries sind parametrisiert
 * (`$1`, `$2`, ...), um SQL-Injection zu verhindern.
 */
class PostgreTaskRepository implements TaskRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<Task[]> {
		const result = await this.pool.query(
			"SELECT * " + "FROM task " + "ORDER BY title ASC;",
		);
		return result.rows.map(
			(row) => new Task(row.title, row.description, row.project, row.id),
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
			(row) => new Task(row.title, row.description, row.project, row.id),
		);
	}

	async add(task: Task): Promise<void> {
		await this.pool.query(
			"INSERT INTO task (id, title, description, project) " + "VALUES ($1, $2, $3);",
			[task.id, task.title, task.Description],
		);
	}

	async delete(id: string): Promise<void> {
		await this.pool.query("DELETE FROM task " + "WHERE id = $1;", [id]);
	}
}
