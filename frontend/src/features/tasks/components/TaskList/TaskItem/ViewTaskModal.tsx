import {Modal, type ModalProps} from "@/shared/components/Modal.tsx";
import {type ChangeEvent, type SubmitEvent, useEffect, useState} from "react";
import { useTasks } from "@/features/tasks/context/TasksContext.tsx";
import { useProjects } from "@/features/projects/context/ProjectsContext";
import { updateTask } from "@/features/tasks/api/TaskApi";
import { CalendarModal } from "@/features/tasks/components/CalendarModal.tsx";
import { Button } from "@/shared/components/Button.tsx";
import type { TaskDto } from "shared";

interface TaskModalProps extends Pick<ModalProps, "open" | "onClose">{
	task: TaskDto;
}

/**
 * Formular zum Bearbeiten einer bestehenden Aufgabe, gerendert innerhalb
 * von `Modal`. Hält Titel/Beschreibung/Projekt als Controlled-Components
 * (`useState` pro Feld); ein `useEffect` füllt sie jedes Mal, wenn das
 * Modal geöffnet wird, mit den aktuellen Werten von `task` – nicht nur
 * einmalig beim ersten Rendern, sonst würden nach einer erfolgreichen
 * Bearbeitung beim erneuten Öffnen veraltete Werte angezeigt. Schickt die
 * Werte bei Submit per `PUT /tasks/:id` ans Backend. Nur bei erfolgreicher
 * Antwort werden `loadTasks` (aus dem `TasksContext`) aufgerufen und das
 * Modal geschlossen – bei einem Fehler bleibt das Formular mit der
 * Eingabe und einer Fehlermeldung (`submitError`) offen.
 */
export function ViewTaskModal({open, onClose, task}:TaskModalProps) {
	const { loadTasks } = useTasks();
	const { loadProjects } = useProjects();
	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task.description);
	const [project, setProject] = useState(task.project.name);
	const [date, setDate] = useState(task.date ?? "");
	const [time, setTime] = useState(task.time ?? "");
	const [duration, setDuration] = useState(task.duration);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [submitError, setSubmitError] = useState("");

	useEffect(() => {
		if (open) {
			setTitle(task.title);
			setDescription(task.description);
			setProject(task.project.name);
			setDate(task.date ?? "");
			setTime(task.time ?? "");
			setDuration(task.duration);
			setSubmitError("");
		}
	}, [open, task]);

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

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setSubmitError("");

		try {
			await updateTask({ id: task.id, title, description, project, date: date || undefined, time: time || undefined, duration });

			loadTasks();
			loadProjects();
			onClose();
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Unbekannter Fehler");
		}
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			style={{
				width: "30rem",
				height: "20rem",
				backgroundColor: "var(--accent-dark)",
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
					style={{
						fontSize: "var(--large-font-size)",
						fontWeight: "bold",
						width: "100%",
						boxSizing: "border-box",
					}}
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
				<Button
					onClick={() => setIsCalendarOpen(!isCalendarOpen)}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={{
						backgroundColor: isHovered
						? "color-mix(in srgb, var(--accent) 80%, white)"
						: "var(--accent)",
					}}
				>{date ? `${date}${time ? ` ${time}` : ""}` : "Add Date"}</Button>
				<CalendarModal
					open={isCalendarOpen}
					onClose={() => setIsCalendarOpen(false)}
					date={date}
					time={time}
					duration={duration}
					onDateChange={setDate}
					onTimeChange={setTime}
					onDurationChange={setDuration}
				/>
				<button
					type="submit"
					style={{alignSelf: "flex-end",}}
				>
					Submit
				</button>
				{submitError && <p style={{ color: "red" }}>{submitError}</p>}
			</form>
		</Modal>
	);
}
