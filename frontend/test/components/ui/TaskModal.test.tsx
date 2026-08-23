import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskModal } from "../../../src/components/ui/TaskModal";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("TaskModal", () => {
	it("schickt Titel und Beschreibung per POST und meldet Erfolg", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
		vi.stubGlobal("fetch", fetchMock);
		const onTaskCreated = vi.fn();
		const onClose = vi.fn();

		render(<TaskModal open={true} onClose={onClose} onTaskCreated={onTaskCreated} />);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.type(screen.getByPlaceholderText("Description"), "Beschreibung");
		await userEvent.click(screen.getByText("Submit"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks",
			expect.objectContaining({ method: "POST" }),
		);
		expect(onTaskCreated).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("zeigt eine Fehlermeldung, wenn der Request fehlschlägt, und schließt nicht", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
		const onTaskCreated = vi.fn();
		const onClose = vi.fn();

		render(<TaskModal open={true} onClose={onClose} onTaskCreated={onTaskCreated} />);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(await screen.findByText(/Fehler beim Erstellen der Aufgabe/)).toBeInTheDocument();
		expect(onTaskCreated).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});
});
