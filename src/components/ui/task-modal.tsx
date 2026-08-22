import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

interface TaskModalProps {
	open: boolean;
	onClose: () => void;
	onTaskCreated: () => void;
}

export function TaskModal({ open, onClose, onTaskCreated }: TaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [project, setProject] = useState("");
	const [submitError, setSubmitError] = useState("");

	function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setTitle(value);
		if (value.length === 0 || value.length > 500) {
			setTitle("Title is too long");
			// später ändern, dass ein Modal geöffnet wird mit der Anzeige und es wird gekappt und nicht weiter eingegeben
		}
	}

	function handleDescriptionChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setDescription(value);
		if (value.length > 2000) {
			setDescription("Description is too long");
		}
	}

	function handleProjectChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setProject(value);
		if (value.length > 50) {
			setProject("Too long");
		}
	}

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError("");

		try {
			const response = await fetch("http://localhost:3000/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});

			if (!response.ok) {
				setSubmitError(`Fehler beim Erstellen der Aufgabe (Status ${response.status})`);
				return;
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
				<input
					type="text"
					placeholder="Project"
					value={project}
					onChange={e => handleProjectChange(e)}
				/>
				<button type="submit">Submit</button>
				{submitError && <p style={{ color: "red" }}>{submitError}</p>}
			</form>
		</Modal>
	);
}
