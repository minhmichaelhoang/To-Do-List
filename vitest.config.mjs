	import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			// Nur die Bausteine mit echter Logik: Backend Domain + Application
			// (hexagonale Architektur verspricht dort isolierte Testbarkeit) und
			// Frontend-Komponenten in components/ui. App.tsx/main.tsx/Server.ts/
			// index.ts sind Composition Roots/Verdrahtung, keine Coverage-Pflicht.
			include: [
				"backend/src/domain/**",
				"backend/src/application/**",
				"frontend/src/components/ui/**",
			],
			thresholds: {
				statements: 70,
				branches: 70,
				functions: 70,
				lines: 70,
			},
		},
		projects: [
			{
				test: {
					name: "backend",
					environment: "node",
					include: ["backend/test/**/*.test.ts"],
				},
			},
			{
				plugins: [react()],
				resolve: {
					alias: {
						"@": path.resolve(import.meta.dirname, "frontend/src"),
					},
				},
				test: {
					name: "frontend",
					environment: "jsdom",
					include: ["frontend/test/**/*.test.tsx"],
					setupFiles: ["frontend/test/Setup.ts"],
				},
			},
		],
	},
});
