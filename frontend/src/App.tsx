import { useTasks } from "@/features/tasks/context/TasksContext";
import { useProjects } from "@/features/projects/context/ProjectsContext";
import { NavigationBar } from "@/navigation/NavigationBar.tsx";
import { useNavigation } from "@/navigation/NavigationContext";
import { filterTasksByActiveView } from "@/navigation/FilterTasksByActiveView";
import { titleForActiveView } from "@/navigation/ActiveViewTitle";
import { taskLayouts } from "@/layouts";

/**
 * Treibender Client der REST-API. Holt Tasks/Projekte aus den Contexts,
 * filtert sie anhand der aktiven Ansicht (`NavigationContext.activeView`)
 * und übergibt Titel + Tasks nur als Props an das aktuell gewählte Layout
 * (`layouts/`) – das Layout selbst kennt weder `TasksContext` noch
 * `ProjectsContext` noch `NavigationContext`.
 */
function App() {
	const { tasks } = useTasks();
	const { projects } = useProjects();
	const { activeView, layout } = useNavigation();

	const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));
	const visibleTasks = filterTasksByActiveView(tasks, activeView);
	const title = titleForActiveView(activeView, projects);

	const TaskLayout = taskLayouts[layout];

	return (
		<div style={{ display: "flex", flexDirection: "row" }}>
			<NavigationBar projects={sortedProjects}/>
			<div
			style={{
				padding: "2rem",
				maxWidth: "50rem",
				margin: "0 auto",
				display: "flex",
				flexDirection: "column",
				alignContent: "center",
			}}>
				<TaskLayout title={title} tasks={visibleTasks} />
			</div>
		</div>
	);
}

export default App;
