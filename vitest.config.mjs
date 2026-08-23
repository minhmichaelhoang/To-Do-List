import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		coverage: {
			provider: "v8",
			// Nur Domain + Application: hier verspricht hexagonale Architektur
			// isolierte Testbarkeit. Adapter/HTTP/Composition-Roots sind
			// größtenteils Verdrahtung, keine Coverage-Pflicht.
			include: ["backend/src/domain/**", "backend/src/application/**"],
			thresholds: {
				statements: 70,
				branches: 70,
				functions: 70,
				lines: 70,
			},
		},
	},
});
