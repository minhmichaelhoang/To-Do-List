import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { ProjectDto } from "shared";
import { getProjects } from "@/features/projects/api/ProjectApi";

interface ProjectsContextValue {
	projects: ProjectDto[];
	loadProjects: () => void;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

/**
 * Stellt die Projekt-Liste und `loadProjects` (Neuladen) für den gesamten
 * Unterbaum bereit – analog zu `TasksContext`. Lädt die Projekte einmalig
 * beim Mounten; ein neues, implizit über einen Task angelegtes Projekt
 * erscheint daher erst nach einem manuellen `loadProjects()`-Aufruf oder
 * Neuladen der Seite. Welches Projekt gerade *ausgewählt* ist, gehört nicht
 * hierher, sondern zu `NavigationContext` (`activeView`) – das ist eine
 * Navigations-/Anzeige-Entscheidung, keine Eigenschaft der Projekt-Liste
 * selbst.
 */
export function ProjectsProvider({ children }: { children: ReactNode }) {
	const [projects, setProjects] = useState<ProjectDto[]>([]);

	function loadProjects() {
		getProjects()
			.then((data) => setProjects(data))
			.catch((error) => console.error(error));
	}

	useEffect(() => {
		loadProjects();
	}, []);

	return (
		<ProjectsContext.Provider value={{ projects, loadProjects }}>
			{children}
		</ProjectsContext.Provider>
	);
}

/** Zugriff auf `projects`/`loadProjects` aus dem `ProjectsContext`. Muss innerhalb eines `ProjectsProvider` aufgerufen werden. */
export function useProjects() {
	const context = useContext(ProjectsContext);
	if (!context) {
		throw new Error("useProjects must be used within a ProjectsProvider");
	}
	return context;
}
