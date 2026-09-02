import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CreateTaskDto, ProjectDto, TaskDto } from "shared";
import { createTask, getTasks } from "@/features/tasks/api/TaskApi";
import { useProjects } from "@/features/projects/context/ProjectsContext";

/** Neutrale Default-Farbe für den optimistischen Platzhalter, solange das echte (ggf. neu angelegte) Projekt noch nicht vom Server bekannt ist – spiegelt `DEFAULT_PROJECT_COLOR` im Backend (`Project.ts`). */
const OPTIMISTIC_PROJECT_COLOR = "#9CA3AF";

interface TasksContextValue {
	tasks: TaskDto[];
	loadTasks: () => void;
	createTaskOptimistically: (data: CreateTaskDto) => void;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Findet das per Name gemeinte Projekt in der bereits geladenen Liste
 * (case-insensitive, leer/fehlend → "Inbox") – oder baut einen
 * Platzhalter, falls es (noch) nicht existiert, z.B. weil es gerade erst
 * durch diesen Task entsteht. Spiegelt `FindOrCreateProject` im Backend,
 * rein zur Anzeige – die tatsächliche Auflösung passiert weiterhin dort.
 */
function resolveOptimisticProject(rawName: string | undefined, projects: ProjectDto[]): ProjectDto {
	const name = rawName?.trim() || "Inbox";
	const existing = projects.find((project) => project.name.toLowerCase() === name.toLowerCase());
	return existing ?? { id: `optimistic-${name}`, name, color: OPTIMISTIC_PROJECT_COLOR };
}

/**
 * Stellt die Task-Liste, `loadTasks` (Neuladen nach Erstellen/Löschen) und
 * `createTaskOptimistically` für den gesamten Unterbaum bereit – ersetzt
 * das Durchreichen von `onTaskCreated`/`onTaskDeleted`-Callback-Props durch
 * mehrere Komponenten-Ebenen. Lädt die Tasks einmalig beim Mounten.
 */
export function TasksProvider({ children }: { children: ReactNode }) {
	const [tasks, setTasks] = useState<TaskDto[]>([]);
	const { projects, loadProjects } = useProjects();

	function loadTasks() {
		getTasks()
			.then((data) => setTasks(data))
			.catch((error) => console.error(error));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	/**
	 * Fügt den Task sofort lokal hinzu (optimistisch, mit einer vorläufigen
	 * ID), statt auf die Server-Antwort zu warten – so wirkt das Anlegen
	 * instant, unabhängig davon, wie lange der eigentliche Request dauert.
	 * Der `POST` läuft im Hintergrund weiter: bei Erfolg wird per
	 * `loadTasks`/`loadProjects` mit den echten Server-Daten abgeglichen
	 * (ersetzt die vorläufige ID); schlägt er fehl, wird der Platzhalter
	 * wieder entfernt und der Fehler gemeldet.
	 */
	function createTaskOptimistically(data: CreateTaskDto) {
		const optimisticTask: TaskDto = {
			id: `optimistic-${crypto.randomUUID()}`,
			title: data.title,
			description: data.description,
			project: resolveOptimisticProject(data.project, projects),
			date: data.date,
			time: data.time,
			duration: data.duration,
		};

		setTasks((current) => [...current, optimisticTask]);

		createTask(data)
			.then(() => {
				loadTasks();
				loadProjects();
			})
			.catch((error) => {
				setTasks((current) => current.filter((task) => task.id !== optimisticTask.id));
				window.alert(error instanceof Error ? error.message : "Aufgabe konnte nicht angelegt werden.");
			});
	}

	return (
		<TasksContext.Provider value={{ tasks, loadTasks, createTaskOptimistically }}>
			{children}
		</TasksContext.Provider>
	);
}

/** Zugriff auf `tasks`/`loadTasks`/`createTaskOptimistically` aus dem `TasksContext`. Muss innerhalb eines `TasksProvider` aufgerufen werden. */
export function useTasks() {
	const context = useContext(TasksContext);
	if (!context) {
		throw new Error("useTasks must be used within a TasksProvider");
	}
	return context;
}
