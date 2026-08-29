import type { ReactNode } from "react";
import { TasksProvider } from "../src/features/tasks/context/TasksContext";
import { ProjectsProvider } from "../src/features/projects/context/ProjectsContext";
import { NavigationProvider } from "../src/navigation/NavigationContext";

/** Bündelt alle Context-Provider, die Task-Komponenten in Tests brauchen (TasksProvider + ProjectsProvider + NavigationProvider), damit nicht jede Testdatei sie einzeln verschachteln muss. */
export function AllProviders({ children }: { children: ReactNode }) {
	return (
		<ProjectsProvider>
			<TasksProvider>
				<NavigationProvider>{children}</NavigationProvider>
			</TasksProvider>
		</ProjectsProvider>
	);
}
