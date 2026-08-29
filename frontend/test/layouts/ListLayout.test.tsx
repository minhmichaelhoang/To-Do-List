import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TaskDto } from "shared";
import { ListLayout } from "../../src/layouts/ListLayout";
import { AllProviders } from "../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

const project = { id: "project-1", name: "Projekt", color: "#123456" };

function makeTask(overrides: Partial<TaskDto>): TaskDto {
	return {
		id: overrides.id ?? "id",
		title: "Titel",
		description: "Beschreibung",
		project,
		...overrides,
	};
}

describe("ListLayout", () => {
	it("zeigt den übergebenen Titel", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout title="Mein Projekt" tasks={[]} />
			</AllProviders>,
		);

		expect(screen.getByText("Mein Projekt")).toBeInTheDocument();
	});

	it("zeigt alle übergebenen Tasks", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout
					title="Titel"
					tasks={[makeTask({ id: "a", title: "Task A" }), makeTask({ id: "b", title: "Task B" })]}
				/>
			</AllProviders>,
		);

		expect(screen.getByText("Task A")).toBeInTheDocument();
		expect(screen.getByText("Task B")).toBeInTheDocument();
	});

	it("sortiert alphabetisch nach Namen, wenn ausgewählt", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout
					title="Titel"
					tasks={[makeTask({ id: "b", title: "Banane" }), makeTask({ id: "a", title: "Apfel" })]}
				/>
			</AllProviders>,
		);

		await userEvent.selectOptions(screen.getByLabelText("Sort by"), "name");

		const titleElements = document.querySelectorAll("strong");
		expect(Array.from(titleElements).map((el) => el.textContent)).toEqual(["Apfel", "Banane"]);
	});

	it("sortiert standardmäßig nach Datum, undatierte Tasks ans Ende", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout
					title="Titel"
					tasks={[
						makeTask({ id: "undated", title: "Undatiert" }),
						makeTask({ id: "later", title: "Später", date: "2099-01-02" }),
						makeTask({ id: "earlier", title: "Früher", date: "2099-01-01" }),
					]}
				/>
			</AllProviders>,
		);

		const titleElements = document.querySelectorAll("strong");
		expect(Array.from(titleElements).map((el) => el.textContent)).toEqual(["Früher", "Später", "Undatiert"]);
	});

	it("sortiert einen undatierten Task hinter einen einzelnen datierten Task (undatiert zuerst übergeben)", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout
					title="Titel"
					tasks={[
						makeTask({ id: "undated", title: "Undatiert" }),
						makeTask({ id: "dated", title: "Datiert", date: "2099-01-01" }),
					]}
				/>
			</AllProviders>,
		);

		const titleElements = document.querySelectorAll("strong");
		expect(Array.from(titleElements).map((el) => el.textContent)).toEqual(["Datiert", "Undatiert"]);
	});

	it("sortiert einen undatierten Task hinter einen einzelnen datierten Task (datiert zuerst übergeben)", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ListLayout
					title="Titel"
					tasks={[
						makeTask({ id: "dated", title: "Datiert", date: "2099-01-01" }),
						makeTask({ id: "undated", title: "Undatiert" }),
					]}
				/>
			</AllProviders>,
		);

		const titleElements = document.querySelectorAll("strong");
		expect(Array.from(titleElements).map((el) => el.textContent)).toEqual(["Datiert", "Undatiert"]);
	});
});
