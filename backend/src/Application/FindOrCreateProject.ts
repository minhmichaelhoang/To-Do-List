import { ProjectRepository } from "../Ports/ProjectRepository";
import { Project, INBOX_PROJECT_NAME } from "../Domain/Project";

/**
 * Application Service / Use Case. Löst einen vom Nutzer eingetippten
 * Projektnamen zu einem `Project` auf – von `AddTask`/`EditTask` genutzt,
 * da Tasks immer einem Projekt zugeordnet sind. Ein leerer/fehlender Name
 * landet im Projekt "Inbox"; ein noch unbekannter Name wird automatisch als
 * neues Projekt angelegt (mit `Project`s Default-Farbe, da das
 * Task-Formular keine Farbe abfragt).
 */
export class FindOrCreateProject {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(rawName: string | undefined): Promise<Project> {
		const name = rawName?.trim() || INBOX_PROJECT_NAME;

		const existing = await this.projectRepository.findByName(name);
		if (existing) {
			return existing;
		}

		const project = new Project(name);
		await this.projectRepository.add(project);
		return project;
	}
}
