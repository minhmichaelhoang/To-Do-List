import type { ProjectDto } from "shared"
import {ProjectButton} from "@/features/projects/components/ProjectButton.tsx";
import type { ActiveView } from "@/navigation/ActiveView";
import { SmartViewButton } from "@/navigation/SmartViewButton";
import { useState } from "react";
import { useMediaQuery } from "@/shared/hooks/UseMediaQuery";

interface NavigationProps {
	projects: ProjectDto[]
}

const smartViews: { view: ActiveView; label: string }[] = [
	{ view: { kind: "inbox" }, label: "Inbox" },
	{ view: { kind: "today" }, label: "Today" },
	{ view: { kind: "upcoming" }, label: "Upcoming" },
];

const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Navigationsleiste: feste Smart Views (Inbox/Heute/Demnächst) oben, alle
 * Projekte darunter. Ein-/ausfahrbar über einen Toggle-Button. Auf dem
 * Desktop schiebt sie beim Schließen den Hauptinhalt zur Seite (bleibt Teil
 * des Flex-Layouts, standardmäßig offen); auf schmalen Bildschirmen
 * (`MOBILE_QUERY`) legt sie sich stattdessen als Overlay mit Backdrop über
 * den Inhalt (standardmäßig zu), da sie sonst den ganzen Bildschirm nehmen
 * würde. Klick auf den Backdrop schließt, wie bei `Modal`.
 *
 * @param props die Property
 * @param props.projects die anzuzeigenden Projekte, bereits in der gewünschten Reihenfolge
 */
export function NavigationBar({projects}: NavigationProps) {
	const isMobile = useMediaQuery(MOBILE_QUERY);
	const [isOpen, setIsOpen] = useState(!isMobile);

	return (
		<div style={{ position: isMobile ? "fixed" : "relative", top: 0, left: 0, zIndex: 15 }}>
			<button
				onClick={() => setIsOpen((open) => !open)}
				className={"button"}
				style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 20 }}
			>
				{isOpen ? "×" : "☰"}
			</button>

			{isMobile && isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					style={{
						position: "fixed",
						inset: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						zIndex: 10,
					}}
				/>
			)}

			<div
				style={{
					position: "relative",
					zIndex: 15,
					width: isOpen ? "14rem" : "0",
					height: "100vh",
					overflow: "hidden",
					transition: "width 0.2s ease",
					paddingTop: "4rem",
					paddingInline: isOpen ? "1rem" : "0",
					background: "var(--foreground)",
				}}>
				<ul>
					<strong style={{color: "var(--primary)"}}>Views</strong>
					{smartViews.map(({ view, label }) => (
						<li key={view.kind}>
							<SmartViewButton view={view} label={label}/>
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
		</div>
	)
}
