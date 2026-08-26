import { AddButton } from "@/components/task/AddButton";
import {TaskItem} from "@/components/task/TaskItem.tsx";
import { useTasks } from "@/context/TasksContext";

/** Treibender Client der REST-API: liest Tasks aus dem `TasksContext` und rendert die Liste. */
function App() {
	const { tasks } = useTasks();

	return (
		<div
		style={{
			maxHeight: "100vh",
			padding: "2rem",
			maxWidth: "30vw",
			margin: "0 auto",

		}}>
			<h1 style={{
				textAlign: "center",
				color: "#f9f9f9",
				fontSize: "1.5rem",
				fontWeight: "bold",
			}}>
				To Do List
			</h1>

			<ul className="space-y-2">
				{tasks.map((task) => (
					<li
						key={task.id}
					>
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
