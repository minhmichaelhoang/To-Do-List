import type {TaskDto} from "shared/src/TaskDto.ts";
import {Checkbox} from "@/components/task/Checkbox.tsx";
import { useState} from "react";
import {ViewTaskModal} from "@/components/task/ViewTaskModal.tsx";

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
export function TaskItem(
	{
		task
	}: TaskItemProps) {

	const[isOpen, setIsOpen] = useState(false);

	return (
		<div style={{ position: 'relative'}}>
			<button
					onClick={() => setIsOpen(true)}
					className={"container"}
				>
					<div
						style={{
							display:"flex",
							flexDirection:"column",
							position:"relative",
							left: "3rem",
							textAlign: "left",
							minHeight: "3rem"
						}}
					>
						<strong>{task.title}</strong>
						<span>{task.description}</span>
						<span>{task.project}</span>
					</div>
			</button>
			<Checkbox
				taskId={task.id}
				style={{ position: "absolute", top: "1rem", left: "2rem" }}
			/>
			<ViewTaskModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				taskId={task.id}
			/>
		</div>
	)
}
