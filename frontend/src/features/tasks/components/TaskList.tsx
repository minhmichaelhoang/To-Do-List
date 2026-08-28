import {TaskItem} from "@/features/tasks/components/TaskItem.tsx";
import type {TaskDto} from "shared";

interface TaskListProps {
	tasks: TaskDto[];
}

/**
 * Listet alle Tasks in Listenform auf.
 *
 * @param props die Properties
 * @param props.tasks die Tasks
 */
export function TaskList({ tasks }: TaskListProps) {
	return (
		<ul className="space-y-3">
			{tasks.map((task) => (
				<li key={task.id}>
					<TaskItem task={task} />
				</li>
			))}
		</ul>
	)
}
