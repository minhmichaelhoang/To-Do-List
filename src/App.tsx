import { useEffect, useState } from "react";
import type { TaskDto } from "shared";
import { AddButton } from "@/components/ui/add-button";

/** Treibender Client der REST-API: ruft beim Mounten `GET /tasks` ab und rendert die Liste. */
function App() {
	const [tasks, setTasks] = useState<TaskDto[]>([]);

	function loadTasks() {
		fetch("http://localhost:3000/tasks")
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Fehler beim Laden der Tasks (Status ${response.status})`);
				}
				return response.json();
			})
			.then((data) => setTasks(data))
			.catch((error) => console.error(error));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="mb-4 text-2xl font-semibold text-gray-900">Tasks</h1>

			<ul className="space-y-2">
				{tasks.map((task) => (
					<li
						key={task.id}
						className="flex items-center justify-between rounded-md border border-gray-200 p-3"
					>
						<div>
							<strong className="font-medium text-gray-900">{task.title}</strong>
							<span className="text-gray-600">: {task.description}</span>
						</div>
					</li>
				))}
			</ul>
			<AddButton onTaskCreated={loadTasks} />
		</div>
	);
}

export default App;
