import type { ActiveView } from "@/navigation/ActiveView";
import type { TaskLayoutKey } from "@/layouts";

/** Welche Ansicht (Filter) und welches Layout aktiv sind. */
export interface ViewConfig {
	activeView: ActiveView;
	layout: TaskLayoutKey;
}

/** Startwert beim Öffnen der App, solange der Nutzer noch keine eigene Auswahl (Klick in der Navigationsleiste/Layout-Wahl) getroffen hat. */
export const defaultViewConfig: ViewConfig = {
	activeView: { kind: "inbox" },
	layout: "list",
};
