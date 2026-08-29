import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TasksProvider } from "./features/tasks/context/TasksContext.tsx";
import { ProjectsProvider } from "./features/projects/context/ProjectsContext.tsx";
import { NavigationProvider } from "./navigation/NavigationContext.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ProjectsProvider>
			<TasksProvider>
				<NavigationProvider>
					<App />
				</NavigationProvider>
			</TasksProvider>
		</ProjectsProvider>
	</StrictMode>,
);
