import { Project } from "../Domain/Project";

/**
 * Driven Port (Secondary Port). Von der Application-Schicht definierter
 * Vertrag für Projekt-Persistenz – analog zu `TaskRepository`.
 */
export interface ProjectRepository {
	findAll(): Promise<Project[]>;
	findById(id: string): Promise<Project | undefined>;
	/** Suche ist case-insensitive, damit "Inbox" und "inbox" dasselbe Projekt treffen. */
	findByName(name: string): Promise<Project | undefined>;
	add(project: Project): Promise<void>;
}
