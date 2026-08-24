import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../../../src/components/task/Checkbox";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("Checkbox", () => {
	it("löscht die Aufgabe per DELETE und ruft onBoxChecked auf", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
		vi.stubGlobal("fetch", fetchMock);
		const onBoxChecked = vi.fn();

		render(<Checkbox taskId="abc-123" onBoxChecked={onBoxChecked} />);

		await userEvent.click(screen.getByRole("button"));

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3000/tasks/abc-123",
			expect.objectContaining({ method: "DELETE" }),
		);
		expect(onBoxChecked).toHaveBeenCalledOnce();
	});

	it("zeigt eine Fehlermeldung, wenn das Löschen fehlschlägt, und ruft onBoxChecked nicht auf", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
		const onBoxChecked = vi.fn();

		render(<Checkbox taskId="abc-123" onBoxChecked={onBoxChecked} />);

		await userEvent.click(screen.getByRole("button"));

		expect(await screen.findByText(/Fehler beim Löschen der Aufgabe/)).toBeInTheDocument();
		expect(onBoxChecked).not.toHaveBeenCalled();
	});
});
