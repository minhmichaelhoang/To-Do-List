import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddDateButton } from "../../../../src/features/tasks/components/AddDateButton";

function noop() {}

describe("AddDateButton", () => {
	it("zeigt \"Add Date\", wenn kein Datum gesetzt ist", () => {
		render(
			<AddDateButton
				date=""
				time={undefined}
				duration={undefined}
				onDateChange={noop}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		expect(screen.getByText("Add Date")).toBeInTheDocument();
	});

	it("zeigt Datum und Uhrzeit, wenn beide gesetzt sind", () => {
		render(
			<AddDateButton
				date="2099-01-01"
				time="10:00"
				duration={undefined}
				onDateChange={noop}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		expect(screen.getByText("2099-01-01 10:00")).toBeInTheDocument();
	});

	it("zeigt nur das Datum, wenn keine Uhrzeit gesetzt ist", () => {
		render(
			<AddDateButton
				date="2099-01-01"
				time={undefined}
				duration={undefined}
				onDateChange={noop}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		expect(screen.getByText("2099-01-01")).toBeInTheDocument();
	});

	it("öffnet CalendarModal nach Klick auf den Button", async () => {
		render(
			<AddDateButton
				date=""
				time={undefined}
				duration={undefined}
				onDateChange={noop}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		expect(screen.queryByText("No Date Selected")).not.toBeInTheDocument();

		await userEvent.click(screen.getByText("Add Date"));

		expect(screen.getByText("No Date Selected")).toBeInTheDocument();
	});

	it("wechselt die Hintergrundfarbe beim Hover", async () => {
		render(
			<AddDateButton
				date=""
				time={undefined}
				duration={undefined}
				onDateChange={noop}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		const button = screen.getByText("Add Date");
		expect(button.style.backgroundColor).toBe("var(--accent)");

		await userEvent.hover(button);
		expect(button.style.backgroundColor).toBe("color-mix(in srgb, var(--accent) 80%, white)");

		await userEvent.unhover(button);
		expect(button.style.backgroundColor).toBe("var(--accent)");
	});

	it("ruft onDateChange auf, wenn im geöffneten CalendarModal ein Tag geklickt wird", async () => {
		const onDateChange = vi.fn();

		render(
			<AddDateButton
				date=""
				time={undefined}
				duration={undefined}
				onDateChange={onDateChange}
				onTimeChange={noop}
				onDurationChange={noop}
			/>,
		);

		await userEvent.click(screen.getByText("Add Date"));
		await userEvent.click(screen.getByText("15"));

		expect(onDateChange).toHaveBeenCalledOnce();
	});
});
