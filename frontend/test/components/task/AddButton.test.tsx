import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddButton } from "../../../src/components/task/AddButton";
import { TasksProvider } from "../../../src/context/TasksContext";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("AddButton", () => {
	it("zeigt das CreateTaskModal nicht, bevor der Button geklickt wurde", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<AddButton />
			</TasksProvider>,
		);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
	});

	it("öffnet das CreateTaskModal nach Klick auf den Button", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<TasksProvider>
				<AddButton />
			</TasksProvider>,
		);

		await userEvent.click(screen.getByText("+"));

		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
	});
});
