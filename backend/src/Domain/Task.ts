import { randomUUID } from "crypto";
import { addDays, today } from "shared";

/**
 * Domain entity. Kern der hexagonalen Architektur – kennt weder Ports noch
 * Adapter noch Infrastruktur (kein Express, kein pg). Die ID wird generiert,
 * wenn keine übergeben wird, damit sowohl neue Tasks (ohne `id`) als auch
 * aus der Persistenz rekonstruierte Tasks (mit `id`) über denselben
 * Konstruktor erzeugt werden können. `projectId` referenziert ein `Project`
 * – die Auflösung eines eingetippten Projektnamens zu einer ID übernimmt
 * `FindOrCreateProject`, nicht `Task` selbst.
 */
export class Task {
	/** Maximale Titellänge – anders als "nicht in der Vergangenheit" bei Datum/Uhrzeit eine Invariante, die immer gilt, auch beim Rekonstruieren aus der Persistenz. Daher direkt im Konstruktor/Setter erzwungen. */
	static readonly MAX_TITLE_LENGTH = 50;

	private readonly _id: string;

	constructor(
		private _title: string,
		private _description: string,
		private _projectId: string,
		private _date?: string,
		private _time?: string,
		private _duration?: number,
		private _repeat?: number,
		id: string = randomUUID() // Attribut ist ein Default-Wert und  wird nicht als Parameter übergeben, daher ist das am Ende
	) {
		Task.assertValidTitle(_title);
		Task.assertValidRepeat(_repeat);
		this._repeat = Task.withoutRepeatWhenUndated(_repeat, _date);
		this._id = id;
	}

	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	set title(title: string) {
		Task.assertValidTitle(title);
		this._title = title;
	}

	get Description() {
		return this._description;
	}

	set Description(description: string) {
		this._description = description;
	}

	get projectId() {
		return this._projectId;
	}

	set projectId(projectId: string) {
		this._projectId = projectId;
	}

	get date() {
		return this._date;
	}

	set date(date: string | undefined) {
		this._date = date;
		this._repeat = Task.withoutRepeatWhenUndated(this._repeat, date);
	}

	get time() {
		return this._time;
	}

	set time(time: string | undefined) {
		this._time = time;
	}

	/** Dauer in Minuten, optional. */
	get duration() {
		return this._duration;
	}

	set duration(duration: number | undefined) {
		this._duration = duration;
	}

	/** Wiederholungsintervall in Tagen, optional. `0` oder `undefined` bedeuten "keine Wiederholung". Ohne gesetztes `date` immer `undefined`, siehe `withoutRepeatWhenUndated`. */
	get repeat() {
		return this._repeat;
	}

	set repeat(repeat: number | undefined) {
		Task.assertValidRepeat(repeat);
		this._repeat = Task.withoutRepeatWhenUndated(repeat, this._date);
	}

	/**
	 * Liefert die Folgeaufgabe eines wiederkehrenden Tasks: eine neue `Task`
	 * (eigene ID) mit denselben Eigenschaften – inklusive Uhrzeit, Dauer und
	 * demselben `repeat`, damit die Kette weiterläuft –, deren Datum um
	 * `repeat` Tage weitergeschoben ist. Wird so oft weitergeschoben, bis das
	 * Ergebnis nicht mehr in der Vergangenheit liegt: so bleibt der
	 * ursprüngliche Rhythmus erhalten (bei `repeat = 7` z.B. derselbe
	 * Wochentag), auch wenn eine überfällige Aufgabe erst spät abgehakt wird,
	 * und die Folgeaufgabe scheitert nie an `assertNotInPast`.
	 *
	 * Gibt `undefined` zurück, wenn sich der Task nicht wiederholt – also bei
	 * `repeat` nicht gesetzt oder `0` (fachlich "keine Wiederholung"). Die
	 * Schleife terminiert immer, da `repeat` an dieser Stelle mindestens 1 ist.
	 */
	nextOccurrence(): Task | undefined {
		if (!this._repeat || !this._date) {
			return undefined;
		}

		let date = addDays(this._date, this._repeat);
		while (Task.isInPast(date, this._time)) {
			date = addDays(date, this._repeat);
		}

		return new Task(this._title, this._description, this._projectId, date, this._time, this._duration, this._repeat);
	}

	/**
	 * Liefert das effektive Datum für eine Eingabe: das übergebene `date`,
	 * oder – falls nur `time` gesetzt ist – das heutige Datum, da eine
	 * Uhrzeit ohne Datum implizit "heute" meint.
	 */
	static resolveDate(date?: string, time?: string): string | undefined {
		if (date) {
			return date;
		}
		return time ? today() : undefined;
	}

	/**
	 * Prüft, dass Datum/Uhrzeit nicht in der Vergangenheit liegen, und wirft
	 * andernfalls. Bewusst nicht im Konstruktor erzwungen: Repository-Adapter
	 * nutzen denselben Konstruktor auch, um bereits gespeicherte (ggf.
	 * inzwischen vergangene) Tasks aus der Persistenz zu rekonstruieren –
	 * die Regel gilt nur beim Anlegen/Bearbeiten durch Nutzereingaben, nicht
	 * für jedes erneute Laden.
	 */
	static assertNotInPast(date?: string, time?: string): void {
		if (!Task.isInPast(date, time)) {
			return;
		}

		throw new Error(
			time
				? "Datum/Uhrzeit dürfen nicht in der Vergangenheit liegen."
				: "Das Datum darf nicht in der Vergangenheit liegen.",
		);
	}

	/**
	 * Prüft, ob Datum/Uhrzeit in der Vergangenheit liegen. Ohne Uhrzeit zählt
	 * der gesamte Tag als noch nicht vergangen (Vergleich auf Tagesebene),
	 * mit Uhrzeit wird auf den Zeitpunkt genau verglichen. Als Prädikat
	 * ausgelagert, weil `nextOccurrence` dieselbe Regel in einer Schleife
	 * auswerten muss – ein `throw` wäre dort das falsche Werkzeug.
	 */
	static isInPast(date?: string, time?: string): boolean {
		if (!date && !time) {
			return false;
		}

		if (date && !time) {
			return new Date(`${date}T00:00:00`) < new Date(`${today()}T00:00:00`);
		}

		const effectiveDate = date ?? today();
		return new Date(`${effectiveDate}T${time}`) < new Date();
	}

	private static assertValidTitle(title: string): void {
		if (title.length > Task.MAX_TITLE_LENGTH) {
			throw new Error(`Der Titel darf höchstens ${Task.MAX_TITLE_LENGTH} Zeichen lang sein.`);
		}
	}

	/**
	 * Prüft, dass `repeat` (falls gesetzt) eine nicht-negative Ganzzahl ist –
	 * eine immer gültige Invariante (anders als "nicht in der Vergangenheit"
	 * bei Datum/Uhrzeit), daher direkt im Konstruktor/Setter erzwungen.
	 * `0` ist ein gültiger Wert, wird aber fachlich als "keine Wiederholung"
	 * behandelt (wie ein nicht gesetzter Wert).
	 */
	private static assertValidRepeat(repeat: number | undefined): void {
		if (repeat === undefined) {
			return;
		}
		if (!Number.isInteger(repeat) || repeat < 0) {
			throw new Error("Repeat muss eine nicht-negative Ganzzahl sein.");
		}
	}

	/**
	 * Ein Wiederholungsintervall ohne Datum ist fachlich bedeutungslos – es
	 * gibt keinen Termin, den es weiterschieben könnte. Ein solches `repeat`
	 * wird deshalb still verworfen statt abgelehnt: es ist kein Fehler des
	 * Nutzers, sondern schlicht ein Wert ohne Bedeutung, und ein `throw`
	 * würde ein ansonsten gültiges Anlegen/Bearbeiten scheitern lassen.
	 */
	private static withoutRepeatWhenUndated(repeat: number | undefined, date: string | undefined): number | undefined {
		return date ? repeat : undefined;
	}
}
