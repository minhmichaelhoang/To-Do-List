import tsParser from "@typescript-eslint/parser";
import jsdoc from "eslint-plugin-jsdoc";

export default [
	{
		files: [
			"backend/src/**/*.ts",
			"frontend/src/**/*.{ts,tsx}",
			"shared/src/**/*.ts",
		],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: { jsdoc },
		rules: {
			// publicOnly: nur exportierte Klassen/Funktionen/Interfaces brauchen JSDoc,
			// interne Helfer nicht.
			"jsdoc/require-jsdoc": [
				"error",
				{
					publicOnly: true,
					require: {
						FunctionDeclaration: true,
						ClassDeclaration: true,
					},
					contexts: ["TSInterfaceDeclaration"],
				},
			],
		},
	},
];
