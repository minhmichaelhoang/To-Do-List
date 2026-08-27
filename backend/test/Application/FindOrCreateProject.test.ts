import { describe, expect, it } from "vitest";
import { FindOrCreateProject } from "../../src/Application/FindOrCreateProject";
import { InMemoryProjectRepository } from "../../src/Adapter/InMemoryProjectRepository";

describe("FindOrCreateProject", () => {
	it("legt ein neues Projekt an, wenn der Name noch nicht existiert", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);

		const project = await findOrCreateProject.execute("Projekt");

		expect(project.name).toBe("Projekt");
		expect(await projectRepository.findAll()).toHaveLength(1);
	});

	it("gibt das existierende Projekt zurück, statt ein neues anzulegen", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);

		const first = await findOrCreateProject.execute("Projekt");
		const second = await findOrCreateProject.execute("Projekt");

		expect(second.id).toBe(first.id);
		expect(await projectRepository.findAll()).toHaveLength(1);
	});

	it("findet ein existierendes Projekt unabhängig von Groß-/Kleinschreibung", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);

		const first = await findOrCreateProject.execute("Projekt");
		const second = await findOrCreateProject.execute("projekt");

		expect(second.id).toBe(first.id);
	});

	it("nutzt \"Inbox\" bei fehlendem Namen", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);

		const project = await findOrCreateProject.execute(undefined);

		expect(project.name).toBe("Inbox");
	});

	it("nutzt \"Inbox\" bei leerem/whitespace-only Namen", async () => {
		const projectRepository = new InMemoryProjectRepository();
		const findOrCreateProject = new FindOrCreateProject(projectRepository);

		const project = await findOrCreateProject.execute("   ");

		expect(project.name).toBe("Inbox");
	});
});
