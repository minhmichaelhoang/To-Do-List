import type { ProjectDto } from "shared";
import type { ActiveView } from "@/navigation/ActiveView";

/** Leitet den Anzeigetitel (z.B. für die Layout-Überschrift) aus der aktiven Ansicht ab. */
export function titleForActiveView(activeView: ActiveView, projects: ProjectDto[]): string {
	switch (activeView.kind) {
		case "project":
			return projects.find((project) => project.id === activeView.projectId)?.name ?? "Projekt";
		case "inbox":
			return "Inbox";
		case "today":
			return "Today";
		case "upcoming":
			return "Upcoming";
	}
}
