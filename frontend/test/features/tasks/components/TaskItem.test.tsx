import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TaskDto } from "shared";
import { TaskItem } from "../../../../src/features/tasks/components/TaskItem";
import { TasksProvider } from "../../../../src/features/tasks/context/TasksContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

const task: TaskDto = {
	id: "abc-123",
	title: "Titel",
	description: "Beschreibung",
	project: "Projekt",
};

describe("TaskItem", () => {
	it("zeigt Titel, Beschreibung und Projekt der Aufgabe", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<TaskItem task={task} />
			</TasksProvider>,
		);

		expect(screen.getByText("Titel")).toBeInTheDocument();
		expect(screen.getByText("Beschreibung")).toBeInTheDocument();
		expect(screen.getByText("Projekt")).toBeInTheDocument();
	});

	it("öffnet das ViewTaskModal nach Klick auf die Task-Fläche", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<TaskItem task={task} />
			</TasksProvider>,
		);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();

		await userEvent.click(screen.getByText("Titel"));

		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
	});
});
