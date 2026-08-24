import type {TaskDto} from "shared/src/TaskDto.ts";
import {Checkbox} from "@/components/task/Checkbox.tsx";

interface TaskItemProps {
	onTaskDeleted: () => void;
	task: TaskDto;
}

export function TaskItem(
	{
		onTaskDeleted,
		task
	}: TaskItemProps) {

	return (
		<div
			onClick={() => {}}
			className={"container"}
		>
			<Checkbox onBoxChecked={onTaskDeleted} taskId={task.id}/>
			<div style={{display:"flex", flexDirection:"column"}}>
				<strong>{task.title}</strong>
				<span>{task.description}</span>
				<span>{task.project}</span>
			</div>
		</div>
	)
}
