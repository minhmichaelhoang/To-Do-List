import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../../../src/shared/components/Button";

describe("Button", () => {
	it("rendert seinen Inhalt", () => {
		render(<Button onClick={() => {}}>Klick mich</Button>);

		expect(screen.getByText("Klick mich")).toBeInTheDocument();
	});

	it("ruft onClick beim Klicken auf", async () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Klick mich</Button>);

		await userEvent.click(screen.getByText("Klick mich"));

		expect(onClick).toHaveBeenCalledOnce();
	});
});
