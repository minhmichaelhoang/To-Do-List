import type { CreateTaskDto, EditTaskDto, TaskDto } from "shared";
import { API_BASE_URL } from "@/shared/ApiConfig";

const BASE_URL = `${API_BASE_URL}/tasks`;

/**
 * HTTP-Client für die Task-Ressource des Backends – einziger Ort im
 * Frontend, der Basis-URL und Wire-Format kennt. Komponenten/Context rufen
 * diese Funktionen auf, statt selbst `fetch` mit hartkodierten URLs zu
 * verwenden.
 */
export async function getTasks(): Promise<TaskDto[]> {
	const response = await fetch(BASE_URL);
	if (!response.ok) {
		throw new Error(`Fehler beim Laden der Tasks (Status ${response.status})`);
	}
	return response.json();
}

/** Legt einen neuen Task an. Wirft mit der Backend-Fehlermeldung (z.B. bei einem Datum in der Vergangenheit), wenn der Request fehlschlägt. */
export async function createTask(data: CreateTaskDto): Promise<void> {
	const response = await fetch(BASE_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(await extractErrorMessage(response, "Fehler beim Erstellen der Aufgabe"));
	}
}

/** Überschreibt einen bestehenden Task. Wirft mit der Backend-Fehlermeldung, wenn der Request fehlschlägt. */
export async function updateTask(data: EditTaskDto): Promise<void> {
	const response = await fetch(`${BASE_URL}/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error(await extractErrorMessage(response, "Fehler beim Bearbeiten der Aufgabe"));
	}
}

/** Löscht einen Task per ID. */
export async function deleteTask(id: string): Promise<void> {
	const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
	if (!response.ok) {
		throw new Error(`Fehler beim Löschen der Aufgabe (Status ${response.status})`);
	}
}

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
	try {
		const body = await response.json();
		if (body?.message) {
			return body.message;
		}
	} catch {
		// kein JSON-Body vorhanden - Fallback-Meldung verwenden
	}
	return `${fallback} (Status ${response.status})`;
}
