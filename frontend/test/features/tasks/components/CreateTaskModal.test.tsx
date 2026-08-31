import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTaskModal } from "../../../../src/features/tasks/components/CreateTaskModal";
import { AllProviders } from "../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("CreateTaskModal", () => {
	it("schließt sofort bei Submit, ohne auf den Server zu warten", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));
		const onClose = vi.fn();

		render(
			<AllProviders>
				<CreateTaskModal open={true} onClose={onClose} />
			</AllProviders>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("schickt den Task im Hintergrund per POST", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] });
		vi.stubGlobal("fetch", fetchMock);

		render(
			<AllProviders>
				<CreateTaskModal open={true} onClose={() => {}} />
			</AllProviders>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		await waitFor(() =>
			expect(fetchMock).toHaveBeenCalledWith(
				"http://localhost:3000/tasks",
				expect.objectContaining({ method: "POST" }),
			),
		);
	});

	it("leert das Formular nach dem Submit", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<CreateTaskModal open={true} onClose={() => {}} />
			</AllProviders>,
		);

		await userEvent.type(screen.getByPlaceholderText("Title"), "Titel");
		await userEvent.click(screen.getByText("Submit"));

		expect(screen.getByPlaceholderText("Title")).toHaveValue("");
	});

	it("kappt zu lange Eingaben in Titel, Beschreibung und Projekt", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<CreateTaskModal open={true} onClose={() => {}} />
			</AllProviders>,
		);

		fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "a".repeat(501) } });
		fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "b".repeat(2001) } });
		fireEvent.change(screen.getByPlaceholderText("Project"), { target: { value: "c".repeat(51) } });

		expect(screen.getByPlaceholderText("Title")).toHaveValue("Title is too long");
		expect(screen.getByPlaceholderText("Description")).toHaveValue("Description is too long");
		expect(screen.getByPlaceholderText("Project")).toHaveValue("Too long");
	});
});
