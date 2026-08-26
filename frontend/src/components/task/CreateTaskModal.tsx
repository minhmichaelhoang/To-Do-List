import { Modal } from "@/components/ui/Modal";
import type { ModalProps } from "@/components/ui/Modal";
import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useTasks } from "@/context/TasksContext";

interface CreateModalProps extends Pick<ModalProps, "open" | "onClose"> {}

/**
 * Formular zum Anlegen einer neuen Aufgabe, gerendert innerhalb von `Modal`.
 * Hält Titel/Beschreibung/Projekt als Controlled-Components (`useState` pro
 * Feld) und schickt sie bei Submit per `POST /tasks` ans Backend. Nur bei
 * erfolgreicher Antwort werden Felder zurückgesetzt, `loadTasks` (aus dem
 * `TasksContext`) aufgerufen und das Modal geschlossen – bei einem Fehler
 * bleibt das Formular mit der Eingabe und einer Fehlermeldung (`submitError`) offen.
 */
export function CreateTaskModal({ open, onClose }: CreateModalProps) {
		const { loadTasks } = useTasks();
		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [project, setProject] = useState("");
		const [submitError, setSubmitError] = useState("");

	function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setTitle(value);
		if (value.length > 500) {
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
				body: JSON.stringify({ title, description, project }),
			});

			if (!response.ok) {
				setSubmitError(`Fehler beim Erstellen der Aufgabe (Status ${response.status})`);
				return;
			}

			setTitle("");
			setDescription("");
			setProject("");
			loadTasks();
			onClose();
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Unbekannter Fehler");
		}
	}

	return (
		<Modal
			open={open} onClose={onClose}
			style={{
				width: "33.2%",
				height: "33.2%",
			}}
		>
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					margin: "auto",
					gap: "1rem",
					width: "100%",
					minWidth: 0,

				}}
			>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={e => handleTitleChange(e)}
					style={{fontWeight: "bold", width: "100%", boxSizing: "border-box"}}
					autoFocus
				/>
				<input
					type="text"
					placeholder="Description"
					value={description}
					onChange={e => handleDescriptionChange(e)}
					style={{ width: "100%", boxSizing: "border-box" }}
				/>
				<input
					type="text"
					placeholder="Project"
					value={project}
					onChange={e => handleProjectChange(e)}
					style={{ width: "100%", boxSizing: "border-box" }}
				/>
				<button type="submit" style={{ alignSelf: "flex-end" }}>Submit</button>
				{submitError && <p style={{ color: "red" }}>{submitError}</p>}
			</form>
		</Modal>
	);
}
