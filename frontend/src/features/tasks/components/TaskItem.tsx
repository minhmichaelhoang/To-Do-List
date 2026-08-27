import type {TaskDto} from "shared/src/TaskDto.ts";
import {Checkbox} from "@/features/tasks/components/Checkbox.tsx";
import { useState} from "react";
import {ViewTaskModal} from "@/features/tasks/components/ViewTaskModal.tsx";
import {ProjectDisplay} from "@/features/projects/ProjectDisplay.tsx";

interface TaskItemProps {
	task: TaskDto;
}

/**
 * Erstellt ein Task-Element als Container. Beinhaltet eine Checkbox, die
 * das Löschen direkt über den `TasksContext` erledigt.
 *
 * @param props TaskitemProps
 * @param props.task die Task, die dargestellt werden soll
 */
export function TaskItem({ task }: TaskItemProps) {

	const[isOpen, setIsOpen] = useState(false);

	return (
		<div style={{ position: "relative", width: "30rem"}}>
			<button
				onClick={() => setIsOpen(true)}
				className={"container foreground-button"}
				style={{
					textAlign: "left",
					paddingLeft: "3rem",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<strong>{task.title}</strong>
				<span>{task.description}</span>
				<ProjectDisplay project={task.project}></ProjectDisplay>
				{(task.date || task.time) && (
					<span>{[task.date, task.time].filter(Boolean).join(" ")}</span>
				)}
			</button>
			<Checkbox
				taskId={task.id}
				style={{
					position: "absolute",
					top: "1rem",
					left: "1rem"
			}}
			/>
			<ViewTaskModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				task={task}
			/>
		</div>
	)
}
