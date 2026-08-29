import { afterEach, describe, expect, it, vi } from "vitest";
import { getProjects } from "../../../../src/features/projects/api/ProjectApi";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("ProjectApi", () => {
	it("getProjects lädt die Projekt-Liste per GET", async () => {
		const project = { id: "project-1", name: "Projekt", color: "#123456" };
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [project] });
		vi.stubGlobal("fetch", fetchMock);

		expect(await getProjects()).toEqual([project]);
		expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/projects");
	});

	it("getProjects wirft bei einem fehlgeschlagenen Request", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

		await expect(getProjects()).rejects.toThrow(/Status 500/);
	});
});
