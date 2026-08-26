import { randomUUID } from "crypto";

/**
 * Domain entity. Kern der hexagonalen Architektur – kennt weder Ports noch
 * Adapter noch Infrastruktur (kein Express, kein pg). Die ID wird generiert,
 * wenn keine übergeben wird, damit sowohl neue Tasks (`new Task(t, d)`) als
 * auch aus der Persistenz rekonstruierte Tasks (`new Task(t, d, id)`) über
 * denselben Konstruktor erzeugt werden können.
 */
export class Task {
	private readonly _id: string;

	constructor(
		private _title: string,
		private _description: string,
		private _project: string,
		private _date?: string,
		private _time?: string,
		id: string = randomUUID() // Attribut ist ein Default-Wert und  wird nicht als Parameter übergeben, daher ist das am Ende
	) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	set title(title: string) {
		this._title = title;
	}

	get Description() {
		return this._description;
	}

	set Description(description: string) {
		this._description = description;
	}

	get project() {
		return this._project;
	}

	set project(project: string) {
		this._project = project;
	}

	get date() {
		return this._date;
	}

	set date(date: string | undefined) {
		this._date = date;
	}

	get time() {
		return this._time;
	}

	set time(time: string | undefined) {
		this._time = time;
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
		return time ? Task.today() : undefined;
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
		if (!date && !time) {
			return;
		}

		if (date && !time) {
			if (new Date(`${date}T00:00:00`) < new Date(`${Task.today()}T00:00:00`)) {
				throw new Error("Das Datum darf nicht in der Vergangenheit liegen.");
			}
			return;
		}

		const effectiveDate = date ?? Task.today();
		if (new Date(`${effectiveDate}T${time}`) < new Date()) {
			throw new Error("Datum/Uhrzeit dürfen nicht in der Vergangenheit liegen.");
		}
	}

	private static today(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const day = String(now.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}
}
