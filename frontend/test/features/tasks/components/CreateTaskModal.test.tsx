import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTaskModal } from "../../../../src/features/tasks/components/CreateTaskModal";
import { TasksProvider } from "../../../../src/features/tasks/context/TasksContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("CreateTaskModal", () => {
	it("schickt Titel und Beschreibung per POST und lädt die Liste danach neu", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);
		const onClose = vi.fn();

		render(
			<TasksProvider>
				<CreateTaskModal open={true} onClose={onClose} />
			</TasksProvider>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.type(screen.getByPlaceholderText("Description"), "Beschreibung");
		await userEvent.click(screen.getByText("Submit"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks",
			expect.objectContaining({ method: "POST" }),
		);
		// Mount-GET (TasksProvider) + POST + Reload-GET nach Erfolg
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("zeigt eine Fehlermeldung, wenn der Request fehlschlägt, und schließt nicht", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET
			.mockResolvedValueOnce({ ok: false, status: 500 }); // POST
		vi.stubGlobal("fetch", fetchMock);
		const onClose = vi.fn();

		render(
			<TasksProvider>
				<CreateTaskModal open={true} onClose={onClose} />
			</TasksProvider>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(await screen.findByText(/Fehler beim Erstellen der Aufgabe/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(onClose).not.toHaveBeenCalled();
	});

	it("kappt zu lange Eingaben in Titel, Beschreibung und Projekt", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<CreateTaskModal open={true} onClose={() => {}} />
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
				<CreateTaskModal open={true} onClose={onClose} />
			</TasksProvider>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(await screen.findByText("NetworkError")).toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});
});
