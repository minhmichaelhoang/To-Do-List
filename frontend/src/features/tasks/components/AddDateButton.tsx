import { useState } from "react";
import { Button } from "@/shared/components/Button.tsx";
import { CalendarModal } from "@/features/tasks/components/CalendarModal.tsx";

interface AddDateButtonProps {
	/** Aktuell gewähltes Datum (YYYY-MM-DD) – kontrollierter Wert, gehört dem Aufrufer (`CreateTaskModal`/`ViewTaskModal`), nicht diesem Button. */
	date: string;
	/** Aktuell gewählte Uhrzeit (HH:mm) – kontrollierter Wert, gehört dem Aufrufer. */
	time: string | undefined;
	/** Aktuell gewählte Dauer in Minuten – kontrollierter Wert, gehört dem Aufrufer. */
	duration: number | undefined;
	/** Wiederholungsintervall in Tagen, optional – kontrollierter Wert, gehört dem Aufrufer. */
	repeat: number | undefined;
	onDateChange: (date: string) => void;
	onTimeChange: (time: string) => void;
	onDurationChange: (duration: number) => void;
	onRepeatChange: (repeat: number | undefined) => void;
}

/**
 * Öffnet per Klick ein `CalendarModal` zur Auswahl von Datum/Uhrzeit/Dauer –
 * analog zu `AddButton`, das Trigger-Button + `CreateTaskModal` bündelt.
 * Besitzt nur den offen/geschlossen- und Hover-Zustand des Buttons selbst;
 * `date`/`time`/`duration` gehören dem umgebenden Formular (werden dort mit
 * Titel/Beschreibung/Projekt zusammen submittet) und werden nur an
 * `CalendarModal` durchgereicht, nicht hier gehalten.
 */
export function AddDateButton({ date, time, duration, repeat, onDateChange, onTimeChange, onDurationChange, onRepeatChange }: AddDateButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<Button
				onClick={() => setIsOpen(!isOpen)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					backgroundColor: isHovered
						? "color-mix(in srgb, var(--accent) 80%, white)"
						: "var(--accent)",
				}}
			>{date ? `${date}${time ? ` ${time}` : ""}` : "Add Date"}</Button>
			<CalendarModal
				open={isOpen}
				onClose={() => setIsOpen(false)}
				date={date}
				time={time}
				duration={duration}
				repeat={repeat}
				onDateChange={onDateChange}
				onTimeChange={onTimeChange}
				onDurationChange={onDurationChange}
				onRepeatChange={onRepeatChange}
			/>
		</>
	);
}
