import { randomUUID } from "crypto";

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
		id: string = randomUUID() // Attribut ist ein Default-Wert und  wird nicht als Parameter übergeben, daher ist das am Ende
	) {
		Task.assertValidTitle(_title);
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

	private static assertValidTitle(title: string): void {
		if (title.length > Task.MAX_TITLE_LENGTH) {
			throw new Error(`Der Titel darf höchstens ${Task.MAX_TITLE_LENGTH} Zeichen lang sein.`);
		}
	}
}
