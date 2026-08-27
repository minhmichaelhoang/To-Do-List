import { ProjectRepository } from "../Ports/ProjectRepository";
import { Project } from "../Domain/Project";

/**
 * Driven Adapter (Secondary Adapter). Implementiert `ProjectRepository`
 * ohne echte Persistenz – analog zu `InMemoryTaskRepository`.
 */
export class InMemoryProjectRepository implements ProjectRepository {
	constructor(private readonly projects: Project[] = []) {}

	async findAll(): Promise<Project[]> {
		return [...this.projects];
	}

	async findById(id: string): Promise<Project | undefined> {
		return this.projects.find((project) => project.id === id);
	}

	async findByName(name: string): Promise<Project | undefined> {
		return this.projects.find((project) => project.name.toLowerCase() === name.toLowerCase());
	}

	async add(project: Project): Promise<void> {
		this.projects.push(project);
	}
}
