import { AddButton } from "@/components/task/AddButton";
import {TaskItem} from "@/components/task/TaskItem.tsx";
import { useTasks } from "@/context/TasksContext";

/** Treibender Client der REST-API: liest Tasks aus dem `TasksContext` und rendert die Liste. */
function App() {
	const { tasks } = useTasks();

	return (
		<div
		style={{
			padding: "2rem",
			maxWidth: "50rem",
			margin: "0 auto",

			display: "flex",
			flexDirection: "column",
			alignContent: "center",
		}}>
			<h1 style={{
				textAlign: "center",
				color: "var(--primary)",
				fontWeight: "bold",
			}}>
				To Do List
			</h1>

			<ul className="space-y-3">
				{tasks.map((task) => (
					<li key={task.id}>
						<TaskItem task={task} />
					</li>
				))}
			</ul>

			<div style={{ display: "flex", justifyContent: "center" }}>
				<AddButton />
			</div>
		</div>
	);
}

export default App;
