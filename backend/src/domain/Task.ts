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
}
