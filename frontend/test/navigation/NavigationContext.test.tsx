import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationProvider, useNavigation } from "../../src/navigation/NavigationContext";
import { defaultViewConfig } from "../../src/navigation/DefaultViewConfig";

function Probe() {
	const { activeView, layout, setLayout } = useNavigation();
	return (
		<div>
			<span data-testid="active-view">{JSON.stringify(activeView)}</span>
			<span data-testid="layout">{layout}</span>
			<button onClick={() => setLayout("list")}>set layout</button>
		</div>
	);
}

describe("useNavigation", () => {
	it("wirft, wenn außerhalb eines NavigationProvider aufgerufen", () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() => render(<Probe />)).toThrow("useNavigation must be used within a NavigationProvider");

		consoleError.mockRestore();
	});

	it("startet mit den Werten aus defaultViewConfig", () => {
		render(
			<NavigationProvider>
				<Probe />
			</NavigationProvider>,
		);

		expect(screen.getByTestId("active-view")).toHaveTextContent(JSON.stringify(defaultViewConfig.activeView));
		expect(screen.getByTestId("layout")).toHaveTextContent(defaultViewConfig.layout);
	});

	it("setLayout ändert das gewählte Layout", async () => {
		render(
			<NavigationProvider>
				<Probe />
			</NavigationProvider>,
		);

		await userEvent.click(screen.getByText("set layout"));

		expect(screen.getByTestId("layout")).toHaveTextContent("list");
	});
});
