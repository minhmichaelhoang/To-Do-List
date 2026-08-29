import { useState } from "react";
import { useNavigation } from "@/navigation/NavigationContext";
import type { ActiveView } from "@/navigation/ActiveView";

interface SmartViewButtonProps {
	view: ActiveView;
	label: string;
}

/**
 * Button für eine feste Smart View (Inbox/Heute/Demnächst) in der
 * `NavigationBar`. Eigener `isHovered`-State pro Instanz, damit Hover nur
 * diesen einen Button einfärbt – nicht alle Smart-View-Buttons gemeinsam.
 *
 * @param props die Property
 * @param props.view die `ActiveView`, die per Klick ausgewählt wird
 * @param props.label der angezeigte Text
 */
export function SmartViewButton({ view, label }: SmartViewButtonProps) {
	const [isHovered, setIsHovered] = useState<boolean>()
	const { setActiveView } = useNavigation();

	return (
		<button
			onClick={() => setActiveView(view)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={"button"}
			style={{
				alignItems: "center",
				color: "var(--primary)",
				backgroundColor: isHovered
					? "color-mix(in srgb, var(--background) 80%, white)"
					: "var(--foreground)",
			}}
		>
			{label}
		</button>
	);
}
