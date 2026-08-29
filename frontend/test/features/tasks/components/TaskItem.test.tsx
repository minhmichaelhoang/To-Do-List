import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TaskDto } from "shared";
import { TaskItem } from "../../../../src/features/tasks/components/TaskItem";
import { AllProviders } from "../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

const task: TaskDto = {
	id: "abc-123",
	title: "Titel",
	description: "Beschreibung",
	project: { id: "project-1", name: "Projekt", color: "#123456" },
};

describe("TaskItem", () => {
	it("zeigt Titel, Beschreibung und Projekt der Aufgabe", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<TaskItem task={task} />
			</AllProviders>,
		);

		expect(screen.getByText("Titel")).toBeInTheDocument();
		expect(screen.getByText("Beschreibung")).toBeInTheDocument();
		expect(screen.getByText("Projekt")).toBeInTheDocument();
	});

	it("öffnet das ViewTaskModal nach Klick auf die Task-Fläche", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<TaskItem task={task} />
			</AllProviders>,
		);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();

		await userEvent.click(screen.getByText("Titel"));

		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
	});

	it("schließt das ViewTaskModal wieder, wenn der Backdrop geklickt wird", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<TaskItem task={task} />
			</AllProviders>,
		);

		await userEvent.click(screen.getByText("Titel"));
		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();

		await userEvent.click(screen.getByPlaceholderText("Title").closest("form")!.parentElement!.parentElement!);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
	});

	it("zeigt Datum und Uhrzeit, wenn gesetzt", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<TaskItem task={{ ...task, date: "2099-01-01", time: "10:00" }} />
			</AllProviders>,
		);

		expect(screen.getByText("2099-01-01 10:00")).toBeInTheDocument();
	});

	it("zeigt keine Datum/Uhrzeit-Zeile, wenn beides fehlt", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<TaskItem task={task} />
			</AllProviders>,
		);

		expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
	});
});
