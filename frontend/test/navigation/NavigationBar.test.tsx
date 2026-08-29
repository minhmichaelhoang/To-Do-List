import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationBar } from "../../src/navigation/NavigationBar";
import { AllProviders } from "../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

function stubMatchMedia(matches: boolean) {
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	);
}

const projects = [{ id: "project-1", name: "Projekt", color: "#123456" }];

describe("NavigationBar", () => {
	it("zeigt Smart Views und Projekte", () => {
		stubMatchMedia(false);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<NavigationBar projects={projects} />
			</AllProviders>,
		);

		expect(screen.getByText("Inbox")).toBeInTheDocument();
		expect(screen.getByText("Today")).toBeInTheDocument();
		expect(screen.getByText("Upcoming")).toBeInTheDocument();
		expect(screen.getByText("Projekt")).toBeInTheDocument();
	});

	it("ist auf dem Desktop standardmäßig offen und lässt sich zuklappen", async () => {
		stubMatchMedia(false);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<NavigationBar projects={projects} />
			</AllProviders>,
		);

		const toggle = screen.getByText("×");
		await userEvent.click(toggle);

		expect(screen.getByText("☰")).toBeInTheDocument();
	});

	it("ist auf dem Handy standardmäßig zu und lässt sich per Backdrop-Klick wieder schließen", async () => {
		stubMatchMedia(true);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		const { container } = render(
			<AllProviders>
				<NavigationBar projects={projects} />
			</AllProviders>,
		);

		expect(screen.getByText("☰")).toBeInTheDocument();

		await userEvent.click(screen.getByText("☰"));
		expect(screen.getByText("×")).toBeInTheDocument();

		const backdrop = container.querySelector('[style*="rgba(0, 0, 0, 0.5)"]');
		expect(backdrop).not.toBeNull();
		await userEvent.click(backdrop!);

		expect(screen.getByText("☰")).toBeInTheDocument();
	});
});
