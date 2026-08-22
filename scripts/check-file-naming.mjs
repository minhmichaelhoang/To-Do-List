import { readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const roots = ["backend/src", "frontend/src", "shared/src"];

// Diese Dateinamen sind durch Node/Vite-Konventionen (Modulauflösung,
// index.html-Referenz) vorgegeben und bleiben bewusst klein geschrieben.
const allowedLowercase = new Set(["index.ts", "index.tsx", "main.tsx"]);

const pascalCase = /^[A-Z][A-Za-z0-9]*$/;

function walk(dir, violations) {
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			walk(fullPath, violations);
			continue;
		}

		const ext = extname(entry);
		if (ext !== ".ts" && ext !== ".tsx") {
			continue;
		}
		if (allowedLowercase.has(entry)) {
			continue;
		}

		const name = basename(entry, ext);
		if (!pascalCase.test(name)) {
			violations.push(fullPath);
		}
	}
}

const violations = [];
for (const root of roots) {
	walk(root, violations);
}

if (violations.length > 0) {
	console.error("Dateien folgen nicht der PascalCase-Namenskonvention:");
	for (const file of violations) {
		console.error(`  - ${file}`);
	}
	process.exit(1);
}

console.log("Alle Dateinamen folgen PascalCase.");
