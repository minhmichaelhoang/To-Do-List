import { describe, expect, it } from "vitest";
import { ListProjects } from "../../src/Application/ListProjects";
import { Project } from "../../src/Domain/Project";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";

describe("ListProjects", () => {
	it("gibt alle im Repository gespeicherten Projekte zurück", async () => {
		const projectRepository = new InMemoryProjectRepository([new Project("A"), new Project("B")]);
		const listProjects = new ListProjects(projectRepository);

		const projects = await listProjects.execute();

		expect(projects).toHaveLength(2);
		expect(projects.map((project) => project.name)).toEqual(["A", "B"]);
	});

	it("gibt ein leeres Array zurück, wenn keine Projekte vorhanden sind", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const listProjects = new ListProjects(projectRepository);

		expect(await listProjects.execute()).toEqual([]);
	});
});
