/**
 * Wire-Format für einen Task über die REST-API. Single Source of Truth für
 * die Form, in der Backend (`taskRouter.ts`) und Frontend (`App.tsx`) sich
 * über einen Task einigen – bewusst getrennt von der Backend-internen
 * `Task`-Domain-Klasse, die private Felder und Fachlogik enthält und nicht
 * über die Grenze zum Frontend geteilt werden soll.
 */
export interface TaskDto {
	id: string;
	title: string;
	description: string;
	project: string;
	/** ISO-Datum (YYYY-MM-DD), optional. Bei nur gesetzter `time` wird beim Anlegen/Bearbeiten automatisch das heutige Datum eingesetzt. */
	date?: string;
	/** Uhrzeit (HH:mm), optional. */
	time?: string;
}

/** Eingabe zum Anlegen eines Tasks – wie `TaskDto`, aber ohne `id` (die wird erst beim Anlegen vergeben). */
export type CreateTaskDto = Omit<TaskDto, "id">;
