import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TaskModal } from "@/components/ui/TaskModal";

interface AddButtonProps {
	onTaskCreated: () => void;
}

/**
 * Öffnet per Klick ein `TaskModal` zum Anlegen einer neuen Aufgabe. Besitzt
 * den offen/geschlossen-Zustand des Modals selbst; `onTaskCreated` wird nur
 * durchgereicht, damit der Elternteil (z.B. `App`) nach erfolgreichem
 * Anlegen die Task-Liste neu laden kann.
 */
export function AddButton({ onTaskCreated }: AddButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>add +</Button>
			<TaskModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				onTaskCreated={onTaskCreated}
			/>
		</>
	);
}
