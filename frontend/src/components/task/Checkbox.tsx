import { Button } from "@/components/ui/Button.tsx"
import {useState} from "react";

export interface CheckboxProps {
	onBoxChecked: () => void;
	taskId: string;
}

/**
 * Ein Button, der eine Aufgabe nach ID löscht.
 *
 * @param props die Property
 * @param props.onBoxChecked die Funktion, die zusätzlich bei einem Klicken ausgeführt wird
 * @param props.taskId die ID der Task
 */
export function Checkbox({onBoxChecked, taskId}: CheckboxProps) {
	const [deleteError, setDeleteError] = useState("");

	async function handleClick() {
		try {
			const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				setDeleteError(`Fehler beim Löschen der Aufgabe (Status ${response.status})`)
				return
			}
			onBoxChecked();
		} catch (error) {
			setDeleteError(error instanceof Error ? error.message : "Unbekannter Fehler");
		}
	}

	return (
		<>
			<Button
				onClick={handleClick}
				color={"transparent"}
				borderColor= "#0d0d0d"
				radius={"50rem"}
				height={"1.25rem"}
				width={"1.25rem"}
				padding={"0"}
			/>
			{deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
		</>
	);
}

