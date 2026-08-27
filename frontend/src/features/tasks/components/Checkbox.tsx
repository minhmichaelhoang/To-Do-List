import type { CSSProperties } from "react";
import { Button } from "@/shared/components/Button.tsx"
import {useState} from "react";
import { useTasks } from "@/features/tasks/context/TasksContext";
import { deleteTask } from "@/features/tasks/api/TaskApi";

interface CheckboxProps {
	taskId: string;
	style?: CSSProperties;
}

/**
 * Ein Button, der eine Aufgabe nach ID löscht und danach die Task-Liste
 * über den `TasksContext` neu lädt.
 *
 * @param props die Property
 * @param props.taskId die ID der Task
 * @param props.style optionale Positionierung/Styling, wird an den inneren Button gereicht
 */
export function Checkbox({taskId, style}: CheckboxProps) {
	const { loadTasks } = useTasks();
	const [deleteError, setDeleteError] = useState("");

	async function handleClick() {
		try {
			await deleteTask(taskId);
			loadTasks();
		} catch (error) {
			setDeleteError(error instanceof Error ? error.message : "Unbekannter Fehler");
		}
	}

	return (
		<>
			<Button
				onClick={handleClick}
				style={{
					backgroundColor: "transparent",
					border: "1px solid gray",
					borderRadius: "50rem",
					height: "1.25rem",
					width: "1.25rem",
					padding: "0",
					margin: "0",
					...style,
				}}
			/>
			{deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
		</>
	);
}
