import type { ProjectDto } from "../../../../../shared"
import {ProjectButton} from "@/features/projects/components/ProjectButton.tsx";

interface NavigationProps {
	projects: ProjectDto[]
}

/**
 * Navigationsleiste, die alle Projekte auflistet.
 *
 * @param props die Property
 * @param props.projects die anzuzeigenden Projekte, bereits in der gewünschten Reihenfolge
 */
export function NavigationBar({projects}: NavigationProps) {
	return (
		<div
			style={{
				padding: "1rem",
				background: "var(--foreground)",
				width: "14rem",
				height: "100vh",
			}}>
			<strong style={{color: "var(--primary"}}>Projects</strong>
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
