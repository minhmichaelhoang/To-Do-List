import type {ProjectDto} from "shared/src/ProjectDto.ts"
import {useState} from "react";

interface ProjectButtonProps {
	project: ProjectDto;
}

/**
 * Erstellt ein ProjectDisplay, das ein Projekt anhand
 * ihres Projektnamens und Farbe inline repräsentiert.
 *
 * @param props die Property
 * @param props.project das Projekt
 */
export function ProjectButton({ project }: ProjectButtonProps) {
	const [isHovered, setIsHovered] = useState<boolean>()

	return (
		<button
			onClick={() => {}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={"button"}
			style={{
				alignItems: "center",
				gap: "0.4rem",
				color: "var(--primary)",
				backgroundColor: isHovered
					? "color-mix(in srgb, var(--background) 80%, white)"
					: "var(--foreground)",
			}}
		>
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
	</button>
)
}
