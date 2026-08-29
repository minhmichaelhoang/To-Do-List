import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectButton } from "../../../../src/features/projects/components/ProjectButton";
import { useNavigation } from "../../../../src/navigation/NavigationContext";
import { AllProviders } from "../../../TestProviders";

afterEach(() => {
	vi.unstubAllGlobals();
});

const project = { id: "project-1", name: "Projekt", color: "#123456" };

function ActiveViewProbe() {
	const { activeView } = useNavigation();
	return <span data-testid="active-view">{JSON.stringify(activeView)}</span>;
}

describe("ProjectButton", () => {
	it("zeigt Name und Farbe des Projekts", () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ProjectButton project={project} />
			</AllProviders>,
		);

		expect(screen.getByText("Projekt")).toBeInTheDocument();
	});

	it("wählt das Projekt als aktive Ansicht, wenn geklickt", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ProjectButton project={project} />
				<ActiveViewProbe />
			</AllProviders>,
		);

		await userEvent.click(screen.getByText("Projekt"));

		expect(screen.getByTestId("active-view")).toHaveTextContent(
			JSON.stringify({ kind: "project", projectId: project.id }),
		);
	});

	it("wechselt die Hintergrundfarbe beim Hover", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] }));

		render(
			<AllProviders>
				<ProjectButton project={project} />
			</AllProviders>,
		);

		const button = screen.getByText("Projekt").closest("button")!;
		expect(button.style.backgroundColor).toBe("var(--foreground)");

		await userEvent.hover(button);
		expect(button.style.backgroundColor).toBe("color-mix(in srgb, var(--background) 80%, white)");

		await userEvent.unhover(button);
		expect(button.style.backgroundColor).toBe("var(--foreground)");
	});
});
