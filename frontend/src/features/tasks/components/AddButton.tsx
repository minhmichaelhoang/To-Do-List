import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { CreateTaskModal } from "@/features/tasks/components/AddButton/CreateTaskModal.tsx";

/**
 * Öffnet per Klick ein `CreateTaskModal` zum Anlegen einer neuen Aufgabe.
 * Besitzt nur den offen/geschlossen-Zustand des Modals selbst – das
 * Neuladen der Task-Liste nach dem Anlegen übernimmt `CreateTaskModal`
 * direkt über den `TasksContext`.
 */
export function AddButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					backgroundColor: isHovered
						? "color-mix(in srgb, var(--accent) 80%, white)"
						: "var(--accent)",
				}}
			>
					Add new Task
			</Button>
			<CreateTaskModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
}
