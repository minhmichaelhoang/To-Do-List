import { Modal } from "@/components/ui/modal";
import {useState} from "react";

interface TaskModalProps {
	open: boolean;
	onClose: () => void;
	onTaskCreated: () => void;
}

export function TaskModal({ open, onClose, onTaskCreated }: TaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [submitError, setSubmitError] = useState("");

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setTitle(value);
		if (value.length === 0 || value.length > 500) {
			setTitle("Title is too long");
			// später ändern, dass ein Modal geöffnet wird mit der Anzeige und es wird gekappt und nicht weiter eingegeben
		}
	}

	function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setDescription(value);
		if (value.length > 2000) {
			setDescription("Description is too long");
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError("");

		try {
			const response = await fetch("http://localhost:3000/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});

			if (!response.ok) {
				throw new Error(`Fehler beim Erstellen der Aufgabe (Status ${response.status})`);
			}

			setTitle("");
			setDescription("");
			onTaskCreated();
			onClose();
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Unbekannter Fehler");
		}
	}

	return (
		<Modal open={open} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={e => handleTitleChange(e)}
				/>
				<input
					type="text"
					placeholder="Description"
					value={description}
					onChange={e => handleDescriptionChange(e)}
				/>
				<button type="submit">Submit</button>
				{submitError && <p style={{ color: "red" }}>{submitError}</p>}
			</form>
		</Modal>
	);
}
