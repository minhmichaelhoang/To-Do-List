import type { ProjectDto } from "./ProjectDto";

interface TaskFields {
	title: string;
	description: string;
	/** ISO-Datum (YYYY-MM-DD), optional. Bei nur gesetzter `time` wird beim Anlegen/Bearbeiten automatisch das heutige Datum eingesetzt. */
	date?: string;
	/** Uhrzeit (HH:mm), optional. */
	time?: string;
}

/**
 * Wire-Format für einen Task über die REST-API (Lesen). Single Source of
 * Truth für die Form, in der Backend (`TaskRouter.ts`) und Frontend sich
 * über einen Task einigen – bewusst getrennt von der Backend-internen
 * `Task`-Domain-Klasse, die private Felder und Fachlogik enthält und nicht
 * über die Grenze zum Frontend geteilt werden soll. `project` ist hier das
 * volle, eingebettete Projekt (inkl. Farbe) – anders als bei
 * `CreateTaskDto`/`EditTaskDto`, wo nur der eingetippte Projektname
 * ankommt.
 */
export interface TaskDto extends TaskFields {
	id: string;
	project: ProjectDto;
}

/**
 * Eingabe zum Anlegen eines Tasks. `project` ist der vom Nutzer eingetippte
 * Projektname (nicht das volle `ProjectDto`) – leer/fehlend landet
 * automatisch im Projekt "Inbox", ein noch unbekannter Name wird beim
 * Anlegen automatisch als neues Projekt erzeugt.
 */
export interface CreateTaskDto extends TaskFields {
	project?: string;
}

/** Eingabe zum Bearbeiten eines Tasks – wie `CreateTaskDto`, aber mit `id` der zu bearbeitenden Aufgabe. */
export interface EditTaskDto extends TaskFields {
	id: string;
	project?: string;
}
