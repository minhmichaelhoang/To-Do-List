import { useState } from "react";
import type { TaskDto } from "shared";
import { TaskList } from "@/features/tasks/components/TaskList";
import {AddButton} from "@/features/tasks/components/AddButton.tsx";

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

interface TaskListViewProps {
	title: string;
	tasks: TaskDto[];
}

/**
 * Ansicht "Liste": Titel + sortierbare, flache Task-Liste. Kennt weder
 * `TasksContext` noch `ProjectsContext` – bekommt Titel und Tasks nur über
 * Props, damit sie unabhängig von den Features testbar und gegen andere
 * Ansichten (siehe `layouts/index.ts`) austauschbar bleibt.
 */
export function ListLayout({ title, tasks }: TaskListViewProps) {
	const [sortBy, setSortBy] = useState<SortBy>("date");

	const sortedTasks = [...tasks].sort((a, b) =>
		sortBy === "name" ? a.title.localeCompare(b.title) : compareByDate(a, b),
	);

	return (
		<>
			<h1 style={{ textAlign: "center", color: "var(--primary)", fontWeight: "bold" }}>
				{title}
			</h1>

			<div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
				<label htmlFor="sort-by" style={{ color: "var(--primary)" }}>Sort by</label>
				<select
					id="sort-by"
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as SortBy)}
				>
					<option value="date">Date &amp; Time</option>
					<option value="name">Name</option>
				</select>
			</div>

			<TaskList tasks={sortedTasks} />


			<div style={{ display: "flex", justifyContent: "center" }}>
				<AddButton />
			</div>
		</>
	);
}
