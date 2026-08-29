/**
 * Basis-URL des Backends – einzige Stelle im Frontend, die den Fallback
 * kennt. Überschreibbar über die Umgebungsvariable `VITE_API_URL` (z.B.
 * beim Deployment, wo das Backend nicht unter localhost erreichbar ist).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
