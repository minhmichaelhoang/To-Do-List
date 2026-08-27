import type {ProjectDto} from "shared/src/ProjectDto.ts"

interface ProjectDisplayProps {
	project: ProjectDto;
}

/**
 * Erstellt ein ProjectDisplay, das ein Projekt anhand
 * ihres Projektnamens und Farbe inline repräsentiert.
 *
 * @param props die Property
 * @param props.project das Projekt
 */
export function ProjectDisplay({ project }: ProjectDisplayProps) {

	return (
		<span style={{
			display: "flex",
			alignItems: "center",
			gap: "0.4rem",
			color: "var(--primary)"
		}}>
			<span
				style={{
					display: "inline-block",
					width: "0.6rem",
					height: "0.6rem",
					borderRadius: "50%",
					backgroundColor: project.color,
				}}
			/>
			{project.name}
		</span>
	)
}
