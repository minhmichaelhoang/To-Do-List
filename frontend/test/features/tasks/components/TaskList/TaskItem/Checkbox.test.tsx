import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../../../../../src/features/tasks/components/TaskList/TaskItem/Checkbox";
import { AllProviders } from "../../../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("Checkbox", () => {
	it("hakt die Aufgabe per POST auf den complete-Endpunkt ab und lädt die Liste danach neu", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);

		render(
			<AllProviders>
				<Checkbox taskId="abc-123" />
			</AllProviders>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123/complete",
			expect.objectContaining({ method: "POST" }),
		);
		// Mount-GET Tasks + Mount-GET Projects + POST complete + Reload-GET Tasks nach Erfolg
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it("zeigt eine Fehlermeldung, wenn das Abhaken fehlschlägt, und lädt nicht neu", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET (Tasks oder Projects)
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET (Tasks oder Projects)
			.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) }); // POST complete
		vi.stubGlobal("fetch", fetchMock);

		render(
			<AllProviders>
				<Checkbox taskId="abc-123" />
			</AllProviders>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(await screen.findByText(/Fehler beim Abhaken der Aufgabe/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});
});
