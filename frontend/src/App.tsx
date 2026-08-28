import { useState } from "react";
import type { TaskDto } from "shared";
import { AddButton } from "@/features/tasks/components/AddButton";
import {TaskItem} from "@/features/tasks/components/TaskItem.tsx";
import { useTasks } from "@/features/tasks/context/TasksContext";
import { useProjects } from "@/features/projects/context/ProjectsContext";
import {NavigationBar} from "@/features/projects/components/NavigationBar.tsx";

type SortBy = "date" | "name";

/**
 * Vergleicht zwei Tasks nach Datum/Uhrzeit, aufsteigend (frühestes zuerst).
 * Tasks ohne Datum landen ans Ende, da anstehende Termine wichtiger sind
 * als Tasks ohne Deadline. Fehlende Uhrzeit zählt als Tagesbeginn (00:00).
 * String-Vergleich reicht, da "YYYY-MM-DDTHH:mm" lexikografisch bereits
 * chronologisch sortiert ist.
 */
function compareByDate(a: TaskDto, b: TaskDto): number {
	if (!a.date && !b.date) return 0;
	if (!a.date) return 1;
	if (!b.date) return -1;
	return `${a.date}T${a.time ?? "00:00"}`.localeCompare(`${b.date}T${b.time ?? "00:00"}`);
}

/** Treibender Client der REST-API: liest Tasks aus dem `TasksContext` und rendert die Liste. */
function App() {
	const { tasks } = useTasks();
	const { projects } = useProjects();
	const [sortBy, setSortBy] = useState<SortBy>("date");

	const sortedTasks = [...tasks].sort((a, b) =>
		sortBy === "name" ? a.title.localeCompare(b.title) : compareByDate(a, b),
	);
	const sortedProjects = [...projects].sort((a, b) =>
		a.name.localeCompare(b.name));

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
				<h1 style={{
					textAlign: "center",
					color: "var(--primary)",
					fontWeight: "bold",
				}}>
					To Do List
				</h1>
				<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
					<label htmlFor="sort-by" style={{ color: "var(--primary)" }}>Sortieren nach</label>
					<select
						id="sort-by"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortBy)}
					>
						<option value="date">Datum &amp; Uhrzeit</option>
						<option value="name">Name</option>
					</select>
				</div>

				<ul className="space-y-3">
					{sortedTasks.map((task) => (
						<li key={task.id}>
							<TaskItem task={task} />
						</li>
					))}
				</ul>

				<div style={{ display: "flex", justifyContent: "center" }}>
					<AddButton />
				</div>
			</div>
		</div>
	);
}

export default App;
