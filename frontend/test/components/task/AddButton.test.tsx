import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddButton } from "../../../src/components/task/AddButton";

describe("AddButton", () => {
	it("zeigt das TaskModal nicht, bevor der Button geklickt wurde", () => {
		render(<AddButton onTaskCreated={() => {}} />);

		expect(screen.queryByPlaceholderText("Title")).not.toBeInTheDocument();
	});

	it("öffnet das TaskModal nach Klick auf den Button", async () => {
		render(<AddButton onTaskCreated={() => {}} />);

		await userEvent.click(screen.getByText("add +"));

		expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
	});
});
