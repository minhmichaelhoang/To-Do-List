import type { CSSProperties } from "react";
import { Button } from "@/shared/components/Button.tsx"
import {useState} from "react";
import { useTasks } from "@/features/tasks/context/TasksContext";
import { completeTask } from "@/features/tasks/api/TaskApi";

interface CheckboxProps {
	taskId: string;
	style?: CSSProperties;
}

/**
 * Ein Button, der eine Aufgabe abhakt und danach die Task-Liste über den
 * `TasksContext` neu lädt. Ob dabei nur gelöscht wird oder zusätzlich die
 * nächste Wiederholung entsteht, entscheidet der Use Case `CompleteTask` im
 * Backend – diese Komponente kennt `repeat` bewusst gar nicht.
 *
 * @param props die Property
 * @param props.taskId die ID der Task
 * @param props.style optionale Positionierung/Styling, wird an den inneren Button gereicht
 */
export function Checkbox({taskId, style}: CheckboxProps) {
	const { loadTasks } = useTasks();
	const [completeError, setCompleteError] = useState("");

	async function handleClick() {
		try {
			await completeTask(taskId);
			loadTasks();
		} catch (error) {
			setCompleteError(error instanceof Error ? error.message : "Unbekannter Fehler");
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
			{completeError && <p style={{ color: "red" }}>{completeError}</p>}
		</>
	);
}
