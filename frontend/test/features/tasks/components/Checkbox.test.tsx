import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../../../src/features/tasks/components/Checkbox";
import { AllProviders } from "../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("Checkbox", () => {
	it("löscht die Aufgabe per DELETE und lädt die Liste danach neu", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);

		render(
			<AllProviders>
				<Checkbox taskId="abc-123" />
			</AllProviders>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "DELETE" }),
		);
		// Mount-GET Tasks + Mount-GET Projects + DELETE + Reload-GET Tasks nach Erfolg
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it("zeigt eine Fehlermeldung, wenn das Löschen fehlschlägt, und lädt nicht neu", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET (Tasks oder Projects)
			.mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] }) // Mount-GET (Tasks oder Projects)
			.mockResolvedValueOnce({ ok: false, status: 500 }); // DELETE
		vi.stubGlobal("fetch", fetchMock);

		render(
			<AllProviders>
				<Checkbox taskId="abc-123" />
			</AllProviders>,
		);

		await userEvent.click(screen.getByRole("button"));

		expect(await screen.findByText(/Fehler beim Löschen der Aufgabe/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});
});
