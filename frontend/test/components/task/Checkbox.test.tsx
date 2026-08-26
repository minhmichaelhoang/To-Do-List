import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../../src/components/task/Checkbox";
import { TasksProvider } from "../../../src/context/TasksContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("Checkbox", () => {
	it("löscht die Aufgabe per DELETE und lädt die Liste danach neu", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);

		render(
			<TasksProvider>
				<Checkbox taskId="abc-123" />
			</TasksProvider>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "DELETE" }),
		);
		// Mount-GET (TasksProvider) + DELETE + Reload-GET nach Erfolg
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it("zeigt eine Fehlermeldung, wenn das Löschen fehlschlägt, und lädt nicht neu", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET
			.mockResolvedValueOnce({ ok: false, status: 500 }); // DELETE
		vi.stubGlobal("fetch", fetchMock);

		render(
			<TasksProvider>
				<Checkbox taskId="abc-123" />
			</TasksProvider>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(await screen.findByText(/Fehler beim Löschen der Aufgabe/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});
