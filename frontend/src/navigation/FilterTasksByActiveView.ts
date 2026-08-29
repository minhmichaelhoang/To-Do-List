import type { TaskDto } from "shared";
import type { ActiveView } from "@/navigation/ActiveView";

const INBOX_PROJECT_NAME = "Inbox";

/** Filtert Tasks passend zur aktiven Ansicht (Projekt, Inbox, Heute, Demnächst). */
export function filterTasksByActiveView(tasks: TaskDto[], activeView: ActiveView): TaskDto[] {
	switch (activeView.kind) {
		case "project":
			return tasks.filter((task) => task.project.id === activeView.projectId);
		case "inbox":
			return tasks.filter((task) => task.project.name.toLowerCase() === INBOX_PROJECT_NAME.toLowerCase());
		case "today": {
			const today = todayLocal();
			return tasks.filter((task) => task.date === today);
		}
		case "upcoming": {
			const today = todayLocal();
			return tasks.filter((task) => task.date !== undefined && task.date > today);
		}
	}
}

function todayLocal(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
