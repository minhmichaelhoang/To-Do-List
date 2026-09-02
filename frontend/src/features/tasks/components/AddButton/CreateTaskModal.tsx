import { Modal } from "@/shared/components/Modal";
import type { ModalProps } from "@/shared/components/Modal";
import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useTasks } from "@/features/tasks/context/TasksContext";
import {AddDateButton} from "@/features/tasks/components/AddDateButton.tsx";

interface CreateModalProps extends Pick<ModalProps, "open" | "onClose"> {}

/**
 * Formular zum Anlegen einer neuen Aufgabe, gerendert innerhalb von `Modal`.
 * Hält Titel/Beschreibung/Projekt als Controlled-Components (`useState` pro
 * Feld). Schließt bei Submit sofort und leert das Formular, ohne auf den
 * Server zu warten – `createTaskOptimistically` (aus dem `TasksContext`)
 * zeigt den Task sofort in der Liste an und kümmert sich im Hintergrund um
 * Anlegen/Fehlerbehandlung/Abgleich mit dem Server.
 */
export function CreateTaskModal({ open, onClose }: CreateModalProps) {
		const { createTaskOptimistically } = useTasks();
		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [project, setProject] = useState("");
		const [date, setDate] = useState("");
		const [time, setTime] = useState("");
		const [duration, setDuration] = useState<number>();

	function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setTitle(value);
		if (value.length > 50) {
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

	function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		createTaskOptimistically({ title, description, project, date: date || undefined, time: time || undefined, duration });

		setTitle("");
		setDescription("");
		setProject("");
		setDate("");
		setTime("");
		setDuration(undefined);
		onClose();
	}

	return (
		<Modal
			open={open} onClose={onClose}
			style={{
				width: "30rem",
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
				<AddDateButton
					date={date}
					time={time}
					duration={duration}
					onDateChange={setDate}
					onTimeChange={setTime}
					onDurationChange={setDuration}
				/>
				<button type="submit" style={{ alignSelf: "flex-end" }}>Submit</button>
			</form>
		</Modal>
	);
}
