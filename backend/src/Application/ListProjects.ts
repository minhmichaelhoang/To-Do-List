import { ProjectRepository } from "../Ports/ProjectRepository";
import { Project } from "../Domain/Project";

/**
 * Application Service / Use Case. Orchestriert "alle Projekte auflisten" –
 * analog zu `ListTasks`. Enthält bewusst keine eigene Fachlogik.
 */
export class ListProjects {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(): Promise<Project[]> {
		return this.projectRepository.findAll();
	}
}
