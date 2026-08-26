import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TaskDto } from "shared";
import { ViewTaskModal } from "../../../src/components/task/ViewTaskModal";
import { TasksProvider } from "../../../src/context/TasksContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

const task: TaskDto = {
	id: "abc-123",
	title: "Titel",
	description: "Beschreibung",
	project: "Projekt",
};

describe("ViewTaskModal", () => {
	it("füllt die Felder beim Öffnen mit den Werten der Aufgabe", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<ViewTaskModal open={true} onClose={() => {}} task={task} />
			</TasksProvider>,
		);

		expect(screen.getByPlaceholderText("Title")).toHaveValue("Titel");
		expect(screen.getByPlaceholderText("Description")).toHaveValue("Beschreibung");
		expect(screen.getByPlaceholderText("Project")).toHaveValue("Projekt");
	});

	it("schickt geänderte Werte per PUT und lädt die Liste danach neu", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);
		const onClose = vi.fn();

		render(
			<TasksProvider>
				<ViewTaskModal open={true} onClose={onClose} task={task} />
			</TasksProvider>,
		);

		const titleInput = screen.getByPlaceholderText("Title");
		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, "Neuer Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "PUT" }),
		);
		// Mount-GET (TasksProvider) + PUT + Reload-GET nach Erfolg
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("zeigt eine Fehlermeldung, wenn der Request fehlschlägt, und schließt nicht", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET
			.mockResolvedValueOnce({ ok: false, status: 500 }); // PUT
		vi.stubGlobal("fetch", fetchMock);
		const onClose = vi.fn();

		render(
			<TasksProvider>
				<ViewTaskModal open={true} onClose={onClose} task={task} />
			</TasksProvider>,
		);

		await userEvent.click(screen.getByText("Submit"));

		expect(await screen.findByText(/Fehler beim Bearbeiten der Aufgabe/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("kappt zu lange Eingaben in Titel, Beschreibung und Projekt", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<ViewTaskModal open={true} onClose={() => {}} task={task} />
			</TasksProvider>,
		);

		fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "a".repeat(501) } });
		fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "b".repeat(2001) } });
		fireEvent.change(screen.getByPlaceholderText("Project"), { target: { value: "c".repeat(51) } });

		expect(screen.getByPlaceholderText("Title")).toHaveValue("Title is too long");
		expect(screen.getByPlaceholderText("Description")).toHaveValue("Description is too long");
		expect(screen.getByPlaceholderText("Project")).toHaveValue("Too long");
	});

	it("zeigt eine Fehlermeldung, wenn der Request eine Exception wirft", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("NetworkError")));
		const onClose = vi.fn();

		render(
			<TasksProvider>
				<ViewTaskModal open={true} onClose={onClose} task={task} />
			</TasksProvider>,
		);

		await userEvent.click(screen.getByText("Submit"));

		expect(await screen.findByText("NetworkError")).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});
});
