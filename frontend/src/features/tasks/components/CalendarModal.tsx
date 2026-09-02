import {useState} from "react";
import {Modal, type ModalProps} from "@/shared/components/Modal.tsx";
import { formatIsoDate } from "shared";

interface CalendarModalProps extends Pick<ModalProps, "open" | "onClose"> {
	/** Aktuell gewähltes Datum (YYYY-MM-DD) – kontrollierter Wert, gehört dem Aufrufer (`CreateTaskModal`/`ViewTaskModal`), nicht diesem Modal. */
	date: string;
	/** Aktuell gewählte Uhrzeit (HH:mm) – kontrollierter Wert, gehört dem Aufrufer. */
	time: string | undefined;
	/** Aktuell gewählte Dauer in Minuten – kontrollierter Wert, gehört dem Aufrufer. */
	duration: number | undefined;
	/** Wird bei Klick auf einen Tag aufgerufen, meldet das neue Datum nach oben statt es selbst zu halten. */
	onDateChange: (date: string) => void;
	/** Wird bei Änderung der Uhrzeit aufgerufen, meldet die neue Uhrzeit nach oben statt sie selbst zu halten. */
	onTimeChange: (time: string) => void;
	/** Wird bei Änderung der Dauer aufgerufen, meldet die neue Dauer nach oben statt sie selbst zu halten. */
	onDurationChange: (duration: number) => void;
}

const YEARS_RANGE = 6;
const CUR_YEAR_OFFSET = 0;
const MONTHS_IN_YEAR = 12;
const DAYS_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];
const DAYS_IN_WEEK = 7;
const MAX_DURATION_IN_MINUTES = 240;

function generateYearOptions(year: number): Array<{value: number}> {
	return (
		Array.from({length: YEARS_RANGE})
			.map((_, i) => (
				{value: year - CUR_YEAR_OFFSET + i}
			))
	)
}

function getMonthName(index: number): string {
	return new Date(0, index).toLocaleDateString("default", {month: "long"});
}

function generateMonthOptions() {
	return (
		Array.from({length: MONTHS_IN_YEAR})
			.map((_, i) => ({
				value: i + 1,
				label: getMonthName(i)
			}))
	)
}

/** Wandelt `Date.getDay()` (0=Sonntag...6=Samstag) in eine 1-indexierte Montag-zuerst-Position um (1=Montag...7=Sonntag), passend zu `DAYS_INITIALS`. */
function adjustDayOfWeek(day: number): number {
	if (day === 0) day = 7;
	return day;
}

/** Letzter Tag des angegebenen Kalendermonats (`month` ist 1-12) – `new Date(year, month, 0)` ist der Tag vor Tag 1 des Folgemonats, also der letzte Tag dieses Monats. */
function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}

/**
 * Reine Berechnung des Kalender-Grids für einen Monat, ohne JSX: eine Liste
 * von Wochen, jede Woche eine Liste aus sieben Einträgen (Tageszahl oder
 * `null` als Auffüll-Platzhalter vor dem ersten bzw. nach dem letzten Tag
 * des Monats). Arbeitet rein mit Ganzzahlen statt ein `Date`-Objekt
 * schrittweise zu mutieren, damit die üblichen `Date`-Stolperfallen (Tag
 * defaultet auf 1, Monat 0-indexiert) gar nicht erst auftreten können.
 */
function getCalendarWeeks(year: number, month: number): Array<Array<number | null>> {
	const daysInMonth = getDaysInMonth(year, month);
	const firstWeekdayPosition = adjustDayOfWeek(new Date(year, month - 1, 1).getDay());
	const leadingEmptyCount = firstWeekdayPosition - 1;

	const days: Array<number | null> = [
		...Array.from({length: leadingEmptyCount}, () => null),
		...Array.from({length: daysInMonth}, (_, i) => i + 1),
	];

	const trailingEmptyCount = (DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK)) % DAYS_IN_WEEK;
	days.push(...Array.from({length: trailingEmptyCount}, () => null));

	const weeks: Array<Array<number | null>> = [];
	for (let i = 0; i < days.length; i += DAYS_IN_WEEK) {
		weeks.push(days.slice(i, i + DAYS_IN_WEEK));
	}

	return weeks;
}

function generateDurationOptions(): Array<{value: number; label: string}> {
	const length = Math.floor(MAX_DURATION_IN_MINUTES / 15);

	return (
		Array.from({length})
			.map((_, i) => {
				const totalMinutes = (i + 1) * 15;
				const hours = Math.floor(totalMinutes / 60);
				const minutes = totalMinutes % 60;

				let label: string;
				if (hours >= 1) {
					label = `${hours}h`;
					if (minutes !== 0) {
						label += ` ${minutes}min`;
					}
				} else {
					label = `${minutes}min`;
				}

				return {value: totalMinutes, label};
			})
	)
}


/**
 * Kalender-Auswahl für Jahr/Monat/Tag/Uhrzeit/Dauer. Berechnet das
 * Tages-Grid über `getCalendarWeeks` (reine Funktion, kein `Date`-Mutieren)
 * und rendert es nur noch.
 */
export function CalendarModal({open, onClose, date, time, duration, onDateChange, onTimeChange, onDurationChange}: CalendarModalProps) {
	const CUR_YEAR: number = new Date().getFullYear();
	const CUR_MONTH: number = new Date().getMonth() + 1;

	const [year, setYear] = useState<number>(CUR_YEAR);
	const [month, setMonth] = useState<number>(CUR_MONTH);

	function handleDayClick(day: number) {
		onDateChange(formatIsoDate(year, month, day));
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			style={{
				flexDirection: "column",
				gap: "0.5rem",
				maxWidth: "20rem"
			}}
		>
			<strong>{date || "No Date Selected"}</strong>
			<hr/>

			<div style={{display: "flex", justifyContent: "space-between"}}>
				<label htmlFor={'year'}>Year: </label>
				<select
					id="year"
					value={year}
					onChange={(e) => setYear(Number(e.target.value))}
				>
					{generateYearOptions(CUR_YEAR).map(({value}) =>
						<option key={value} value={value}>{value}</option>
					)}
				</select>
			</div>

			<div style={{display: "flex", justifyContent: "space-between"}}>
				<label htmlFor={'month'}>Month: </label>
				<select
					id="month"
					value={month}
					onChange={(e) => setMonth(Number(e.target.value))}
				>
					{generateMonthOptions().map(({value, label}) =>
						<option key={value} value={value}>{label}</option>
					)}
				</select>
			</div>

			<table style={{ textAlign: "center" }}>
				<thead>
					<tr>
						{DAYS_INITIALS.map((initial, index) =>
							<th key={index}>{initial}</th>
						)}
					</tr>
				</thead>
				<tbody>
					{getCalendarWeeks(year, month).map((week, weekIndex) => (
						<tr key={weekIndex}>
							{week.map((day, dayIndex) =>
								day === null
									? <td key={dayIndex} />
									: <td key={dayIndex}>
										<span className={"calendar-day"} onClick={() => handleDayClick(day)}>
											{day}
										</span>
							</td>
							)}
						</tr>
					))}
				</tbody>
			</table>

			<input
				type={"time"}
				value={time ?? ""}
				onChange={(e) => onTimeChange(e.target.value)}
			/>

			<div style={{display: "flex", justifyContent: "space-between"}}>
				<label htmlFor={'duration'}>Duration: </label>
				<select
					id="duration"
					value={duration ?? ""}
					onChange={(e) => onDurationChange(Number(e.target.value))}
				>
					<option value="" disabled hidden></option>
					{generateDurationOptions().map(({value, label}) => (
						<option key={value} value={value}>{label}</option>
					))}
				</select>
			</div>
		</Modal>
	)
}
