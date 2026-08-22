import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/ui/task-modal";

interface AddButtonProps {
	onTaskCreated: () => void;
}

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
