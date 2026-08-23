import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../../../src/components/ui/Modal";

describe("Modal", () => {
	it("rendert nichts, wenn open false ist", () => {
		const { container } = render(
			<Modal open={false} onClose={() => {}}>
				Inhalt
			</Modal>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("rendert children, wenn open true ist", () => {
		render(
			<Modal open={true} onClose={() => {}}>
				Inhalt
			</Modal>,
		);

		expect(screen.getByText("Inhalt")).toBeInTheDocument();
	});

	it("ruft onClose auf, wenn auf den Backdrop geklickt wird", async () => {
		const onClose = vi.fn();
		render(
			<Modal open={true} onClose={onClose}>
				Inhalt
			</Modal>,
		);

		// "Inhalt" ist direkter Text der Box; ihr Elternelement ist der Backdrop.
		await userEvent.click(screen.getByText("Inhalt").parentElement!);

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("ruft onClose NICHT auf, wenn auf den Inhalt geklickt wird", async () => {
		const onClose = vi.fn();
		render(
			<Modal open={true} onClose={onClose}>
				Inhalt
			</Modal>,
		);

		await userEvent.click(screen.getByText("Inhalt"));

		expect(onClose).not.toHaveBeenCalled();
	});
});
