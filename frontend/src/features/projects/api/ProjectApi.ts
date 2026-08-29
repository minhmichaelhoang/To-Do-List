import type { ProjectDto } from "shared";
import { API_BASE_URL } from "@/shared/ApiConfig";

const BASE_URL = `${API_BASE_URL}/projects`;

/**
 * HTTP-Client für die Project-Ressource des Backends – analog zu `TaskApi`.
 * Aktuell nur lesend, da Projekte über `AddTask`/`EditTask` (Backend
 * `FindOrCreateProject`) implizit angelegt werden, nicht über diesen Client.
 */
export async function getProjects(): Promise<ProjectDto[]> {
	const response = await fetch(BASE_URL);
	if (!response.ok) {
		throw new Error(`Fehler beim Laden der Projekte (Status ${response.status})`);
	}
	return response.json();
}
