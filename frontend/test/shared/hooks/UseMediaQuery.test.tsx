import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "../../../src/shared/hooks/UseMediaQuery";

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

function Probe({ query }: { query: string }) {
	const matches = useMediaQuery(query);
	return <span>{matches ? "matches" : "matches-not"}</span>;
}

describe("useMediaQuery", () => {
	it("gibt true zurück, wenn die Query zutrifft", () => {
		stubMatchMedia(true);

		render(<Probe query="(max-width: 768px)" />);

		expect(screen.getByText("matches")).toBeInTheDocument();
	});

	it("gibt false zurück, wenn die Query nicht zutrifft", () => {
		stubMatchMedia(false);

		render(<Probe query="(max-width: 768px)" />);

		expect(screen.getByText("matches-not")).toBeInTheDocument();
	});
});
