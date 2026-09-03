import { TaskRepository } from "../Ports/TaskRepository";

/**
 * Application Service / Use Case. Hakt eine Aufgabe ab: sie wird gelöscht
 * und – falls sie ein Wiederholungsintervall hat – zuvor durch ihre
 * Folgeaufgabe ersetzt (`Task.nextOccurrence`). Bewusst ein eigener Use Case
 * statt zweier Aufrufe vom Frontend aus: "eine wiederkehrende Aufgabe lebt
 * beim Abhaken weiter" ist eine fachliche Regel und gehört damit hinter den
 * Port, nicht in die UI.
 *
 * Die Folgeaufgabe wird bewusst *vor* dem Löschen angelegt: schlägt der
 * zweite Schritt fehl, sieht der Nutzer eine Aufgabe doppelt (sichtbar und
 * korrigierbar) statt gar nicht mehr (still verloren).
 */
export class CompleteTask {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(id: string): Promise<void> {
		const task = await this.taskRepository.findById(id);

		const next = task?.nextOccurrence();
		if (next) {
			await this.taskRepository.add(next);
		}

		return this.taskRepository.delete(id);
	}
}
