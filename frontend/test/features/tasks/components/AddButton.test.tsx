import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddButton } from "../../../../src/features/tasks/components/AddButton";
import { AllProviders } from "../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("AddButton", () => {
	it("zeigt das CreateTaskModal nicht, bevor der Button geklickt wurde", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<AddButton />
			</AllProviders>,
		);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
	});

	it("öffnet das CreateTaskModal nach Klick auf den Button", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<AddButton />
			</AllProviders>,
		);

		await userEvent.click(screen.getByText("Add new Task"));

		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
	});

	it("wechselt die Hintergrundfarbe beim Hover", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<AddButton />
			</AllProviders>,
		);

		const button = screen.getByText("Add new Task");
		expect(button.style.backgroundColor).toBe("var(--accent)");

		await userEvent.hover(button);
		expect(button.style.backgroundColor).toBe("color-mix(in srgb, var(--accent) 80%, white)");

		await userEvent.unhover(button);
		expect(button.style.backgroundColor).toBe("var(--accent)");
	});
});
