import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SmartViewButton } from "../../src/navigation/SmartViewButton";
import { useNavigation } from "../../src/navigation/NavigationContext";
import { AllProviders } from "../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

function ActiveViewProbe() {
	const { activeView } = useNavigation();
	return <span data-testid="active-view">{JSON.stringify(activeView)}</span>;
}

describe("SmartViewButton", () => {
	it("zeigt das Label", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<SmartViewButton view={{ kind: "today" }} label="Today" />
			</AllProviders>,
		);

		expect(screen.getByText("Today")).toBeInTheDocument();
	});

	it("wählt die übergebene View, wenn geklickt", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<SmartViewButton view={{ kind: "upcoming" }} label="Upcoming" />
				<ActiveViewProbe />
			</AllProviders>,
		);

		await userEvent.click(screen.getByText("Upcoming"));

		expect(screen.getByTestId("active-view")).toHaveTextContent(JSON.stringify({ kind: "upcoming" }));
	});

	it("wechselt die Hintergrundfarbe beim Hover", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<SmartViewButton view={{ kind: "inbox" }} label="Inbox" />
			</AllProviders>,
		);

		const button = screen.getByText("Inbox").closest("button")!;
		expect(button.style.backgroundColor).toBe("var(--foreground)");

		await userEvent.hover(button);
		expect(button.style.backgroundColor).toBe("color-mix(in srgb, var(--background) 80%, white)");

		await userEvent.unhover(button);
		expect(button.style.backgroundColor).toBe("var(--foreground)");
	});
});
