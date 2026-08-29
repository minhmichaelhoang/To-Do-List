/**
 * Beschreibt, welcher Ausschnitt der Tasks gerade angezeigt werden soll –
 * entweder ein konkretes Projekt oder eine der festen "Smart Views"
 * (Inbox/Heute/Demnächst). Discriminated Union statt separater Flags, damit
 * z.B. `projectId` nur existiert, wenn `kind === "project"` ist.
 */
export type ActiveView =
	| { kind: "project"; projectId: string }
	| { kind: "inbox" }
	| { kind: "today" }
	| { kind: "upcoming" };
