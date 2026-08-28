import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ProjectDto } from "shared";
import { getProjects } from "@/features/projects/api/ProjectApi";

interface ProjectsContextValue {
	projects: ProjectDto[];
	loadProjects: () => void;
	selectedProject: ProjectDto | undefined;
	selectProject: (projectId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

/**
 * Stellt die Projekt-Liste, `loadProjects` (Neuladen) und das aktuell
 * ausgewählte Projekt für den gesamten Unterbaum bereit – analog zu
 * `TasksContext`. Lädt die Projekte einmalig beim Mounten; ein neues,
 * implizit über einen Task angelegtes Projekt erscheint daher erst nach
 * einem manuellen `loadProjects()`-Aufruf oder Neuladen der Seite.
 * `selectedProject` wird aus `projects` + `selectedProjectId` abgeleitet
 * statt selbst als Objekt gespeichert zu werden, damit es nach einem
 * `loadProjects()` automatisch aktuell bleibt.
 */
export function ProjectsProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<ProjectDto[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

	function loadProjects() {
		getProjects()
			.then((data) => setProjects(data))
			.catch((error) => console.error(error));
	}

	useEffect(() => {
		loadProjects();
	}, []);

	const selectedProject = projects.find((project) => project.id === selectedProjectId);

	return (
		<ProjectsContext.Provider
			value={{ projects, loadProjects, selectedProject, selectProject: setSelectedProjectId }}
		>
			{children}
		</ProjectsContext.Provider>
	);
}

/** Zugriff auf `projects`/`loadProjects`/`selectedProject`/`selectProject` aus dem `ProjectsContext`. Muss innerhalb eines `ProjectsProvider` aufgerufen werden. */
export function useProjects() {
	const context = useContext(ProjectsContext);
	if (!context) {
		throw new Error("useProjects must be used within a ProjectsProvider");
	}
	return context;
}
