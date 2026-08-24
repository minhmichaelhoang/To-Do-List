import { Button } from "@/components/ui/Button.tsx"
import {useState} from "react";

interface CheckboxProps {
	onBoxChecked: () => void;
	taskId: string;
}

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

