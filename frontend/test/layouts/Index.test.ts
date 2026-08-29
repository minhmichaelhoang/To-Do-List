import { describe, expect, it } from "vitest";
import { taskLayouts } from "../../src/layouts";
import { ListLayout } from "../../src/layouts/ListLayout";

describe("taskLayouts", () => {
	it("registriert ListLayout unter dem Schlüssel \"list\"", () => {
		expect(taskLayouts.list).toBe(ListLayout);
	});
});
