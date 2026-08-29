/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Basis-URL des Backends, z.B. beim Deployment gesetzt. Fallback auf localhost siehe `shared/ApiConfig.ts`. */
	readonly VITE_API_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
