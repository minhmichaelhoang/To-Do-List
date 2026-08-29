import { describe, expect, it } from "vitest";
import { titleForActiveView } from "../../src/navigation/ActiveViewTitle";

const projects = [{ id: "project-a", name: "Projekt A", color: "#111111" }];

describe("titleForActiveView", () => {
	it("gibt den Projektnamen zurück", () => {
		expect(titleForActiveView({ kind: "project", projectId: "project-a" }, projects)).toBe("Projekt A");
	});

	it("gibt einen Fallback zurück, wenn das Projekt nicht (mehr) existiert", () => {
		expect(titleForActiveView({ kind: "project", projectId: "unbekannt" }, projects)).toBe("Projekt");
	});

	it("gibt \"Inbox\" zurück", () => {
		expect(titleForActiveView({ kind: "inbox" }, projects)).toBe("Inbox");
	});

	it("gibt \"Heute\" zurück", () => {
		expect(titleForActiveView({ kind: "today" }, projects)).toBe("Heute");
	});

	it("gibt \"Demnächst\" zurück", () => {
		expect(titleForActiveView({ kind: "upcoming" }, projects)).toBe("Demnächst");
	});
});
