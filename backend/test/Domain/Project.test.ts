import { describe, expect, it } from "vitest";
import { DEFAULT_PROJECT_COLOR, Project } from "../../src/Domain/Project";

describe("Project", () => {
	it("vergibt jedem Projekt eine eigene ID, wenn keine übergeben wird", () => {
		const a = new Project("A");
		const b = new Project("B");

		expect(a.id).not.toBe(b.id);
	});

	it("nutzt die Default-Farbe, wenn keine übergeben wird", () => {
		const project = new Project("A");

		expect(project.color).toBe(DEFAULT_PROJECT_COLOR);
	});

	it("übernimmt eine explizit übergebene Farbe", () => {
		const project = new Project("A", "#ff0000");

		expect(project.color).toBe("#ff0000");
	});

	it("überschreibt name und color über die Setter", () => {
		const project = new Project("A");

		project.name = "B";
		project.color = "#00ff00";

		expect(project.name).toBe("B");
		expect(project.color).toBe("#00ff00");
	});
});
