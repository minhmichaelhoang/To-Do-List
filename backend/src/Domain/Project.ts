import { randomUUID } from "crypto";

/** Name des automatisch existierenden Standard-Projekts für Tasks ohne eingetippten Projektnamen. */
export const INBOX_PROJECT_NAME = "Inbox";

/** Neutrale Default-Farbe für automatisch (ohne explizite Farbwahl) angelegte Projekte. */
export const DEFAULT_PROJECT_COLOR = "#9CA3AF";

/**
 * Domain entity. Ein Projekt, dem Tasks zugeordnet werden. Wird meist nicht
 * explizit über eine eigene Projekt-Verwaltung angelegt, sondern implizit
 * beim Anlegen/Bearbeiten eines Tasks (siehe `FindOrCreateProject`) – daher
 * der Default für `color`.
 */
export class Project {
	private readonly _id: string;

	constructor(
		private _name: string,
		private _color: string = DEFAULT_PROJECT_COLOR,
		id: string = randomUUID(),
	) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	get name() {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get color() {
		return this._color;
	}

	set color(color: string) {
		this._color = color;
	}
}
