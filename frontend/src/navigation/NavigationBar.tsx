import type { ProjectDto } from "shared"
import {ProjectButton} from "@/features/projects/components/ProjectButton.tsx";
import { useNavigation } from "@/navigation/NavigationContext";
import type { ActiveView } from "@/navigation/ActiveView";

interface NavigationProps {
	projects: ProjectDto[]
}

const smartViews: { view: ActiveView; label: string }[] = [
	{ view: { kind: "inbox" }, label: "Inbox" },
	{ view: { kind: "today" }, label: "Today" },
	{ view: { kind: "upcoming" }, label: "Upcoming" },
];

/**
 * Navigationsleiste: feste Smart Views (Inbox/Heute/Demnächst) oben, alle
 * Projekte darunter. Klick wählt die jeweilige `ActiveView` im
 * `NavigationContext` aus; die aktuell aktive Ansicht wird hervorgehoben.
 *
 * @param props die Property
 * @param props.projects die anzuzeigenden Projekte, bereits in der gewünschten Reihenfolge
 */
export function NavigationBar({projects}: NavigationProps) {
	const { activeView, setActiveView } = useNavigation();

	return (
		<div
			style={{
				padding: "1rem",
				background: "var(--foreground)",
				width: "14rem",
				height: "100vh",
			}}>
			<ul>
				{smartViews.map(({ view, label }) => (
					<li key={view.kind}>
						<button
							onClick={() => setActiveView(view)}
							className={"button"}
							style={{
								alignItems: "center",
								color: "var(--primary)",
								backgroundColor: activeView.kind === view.kind ? "var(--accent)" : "var(--foreground)",
							}}
						>
							{label}
						</button>
					</li>
				))}
			</ul>
			<strong style={{color: "var(--primary)"}}>Projects</strong>
			<ul>
				{projects.map((project: ProjectDto) => (
					<li key={project.id}>
						<ProjectButton project={project}/>
					</li>
				))}
			</ul>
		</div>
	)
}
