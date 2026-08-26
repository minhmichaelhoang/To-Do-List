import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { TaskDto } from "shared";

interface TasksContextValue {
	tasks: TaskDto[];
	loadTasks: () => void;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Stellt die Task-Liste und `loadTasks` (Neuladen nach Erstellen/Löschen)
 * für den gesamten Unterbaum bereit – ersetzt das Durchreichen von
 * `onTaskCreated`/`onTaskDeleted`-Callback-Props durch mehrere
 * Komponenten-Ebenen. Lädt die Tasks einmalig beim Mounten.
 */
export function TasksProvider({ children }: { children: ReactNode }) {
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
		<TasksContext.Provider value={{ tasks, loadTasks }}>
			{children}
		</TasksContext.Provider>
	);
}

/** Zugriff auf `tasks`/`loadTasks` aus dem `TasksContext`. Muss innerhalb eines `TasksProvider` aufgerufen werden. */
export function useTasks() {
	const context = useContext(TasksContext);
	if (!context) {
		throw new Error("useTasks must be used within a TasksProvider");
	}
	return context;
}
