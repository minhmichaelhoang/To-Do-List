import { describe, expect, it } from "vitest";
import type { TaskDto } from "shared";
import { filterTasksByActiveView } from "../../src/navigation/FilterTasksByActiveView";

function todayLocal(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

const projectA = { id: "project-a", name: "Projekt A", color: "#111111" };
const inbox = { id: "inbox-id", name: "Inbox", color: "#222222" };

function makeTask(overrides: Partial<TaskDto>): TaskDto {
	return {
		id: overrides.id ?? "id",
		title: "Titel",
		description: "Beschreibung",
		project: projectA,
		...overrides,
	};
}

describe("filterTasksByActiveView", () => {
	it("filtert nach Projekt-ID", () => {
		const tasks = [makeTask({ id: "a", project: projectA }), makeTask({ id: "b", project: inbox })];

		const result = filterTasksByActiveView(tasks, { kind: "project", projectId: projectA.id });

		expect(result.map((t) => t.id)).toEqual(["a"]);
	});

	it("filtert nach Inbox (case-insensitive)", () => {
		const tasks = [
			makeTask({ id: "a", project: { ...inbox, name: "inbox" } }),
			makeTask({ id: "b", project: projectA }),
		];

		const result = filterTasksByActiveView(tasks, { kind: "inbox" });

		expect(result.map((t) => t.id)).toEqual(["a"]);
	});

	it("filtert nach heutigem Datum", () => {
		const today = todayLocal();
		const tasks = [makeTask({ id: "a", date: today }), makeTask({ id: "b", date: "2099-01-01" }), makeTask({ id: "c" })];

		const result = filterTasksByActiveView(tasks, { kind: "today" });

		expect(result.map((t) => t.id)).toEqual(["a"]);
	});

	it("filtert nach zukünftigem Datum (Demnächst), heute ausgeschlossen", () => {
		const today = todayLocal();
		const tasks = [
			makeTask({ id: "a", date: today }),
			makeTask({ id: "b", date: "2099-01-01" }),
			makeTask({ id: "c" }),
		];

		const result = filterTasksByActiveView(tasks, { kind: "upcoming" });

		expect(result.map((t) => t.id)).toEqual(["b"]);
	});
});
