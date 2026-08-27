import type { ReactNode } from "react";
import { TasksProvider } from "../src/features/tasks/context/TasksContext";
import { ProjectsProvider } from "../src/features/projects/context/ProjectsContext";

/** Bündelt alle Context-Provider, die Task-Komponenten in Tests brauchen (TasksProvider + ProjectsProvider), damit nicht jede Testdatei beide einzeln verschachteln muss. */
export function AllProviders({ children }: { children: ReactNode }) {
	return (
		<ProjectsProvider>
			<TasksProvider>{children}</TasksProvider>
		</ProjectsProvider>
	);
}
