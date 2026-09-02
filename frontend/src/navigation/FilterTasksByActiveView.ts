import type { TaskDto } from "shared";
import { today } from "shared";
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
			const currentDate = today();
			return tasks.filter((task) => task.date === currentDate);
		}
		case "upcoming": {
			const currentDate = today();
			return tasks.filter((task) => task.date !== undefined && task.date > currentDate);
		}
	}
}
