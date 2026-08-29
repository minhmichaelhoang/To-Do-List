import { ProjectRepository } from "../Ports/ProjectRepository";
import { Project } from "../Domain/Project";
import { Pool } from "pg";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `ProjectRepository`
 * gegen eine echte Postgres-Datenbank über den `pg`-Pool – analog zu
 * `PostgreTaskRepository`. Erwartet eine Tabelle `project (id, name, color)`.
 */
export class PostgreProjectRepository implements ProjectRepository {
	constructor(private readonly pool: Pool) {}

	async findAll(): Promise<Project[]> {
		const result = await this.pool.query("SELECT * " + "FROM project " + "ORDER BY name ASC;");
		return result.rows.map((row) => new Project(row.name, row.color, row.id));
	}

	async findById(id: string): Promise<Project | undefined> {
		const result = await this.pool.query("SELECT * " + "FROM project " + "WHERE id = $1;", [id]);
		const row = result.rows[0];
		return row ? new Project(row.name, row.color, row.id) : undefined;
	}

	async findByName(name: string): Promise<Project | undefined> {
		const result = await this.pool.query("SELECT * " + "FROM project " + "WHERE name ILIKE $1;", [name]);
		const row = result.rows[0];
		return row ? new Project(row.name, row.color, row.id) : undefined;
	}

	async add(project: Project): Promise<void> {
		await this.pool.query(
			"INSERT INTO project (id, name, color) " + "VALUES ($1, $2, $3);",
			[project.id, project.name, project.color],
		);
	}
}
