import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { ActiveView } from "@/navigation/ActiveView";
import { defaultViewConfig } from "@/navigation/DefaultViewConfig";
import type { TaskLayoutKey } from "@/layouts";

interface NavigationContextValue {
	activeView: ActiveView;
	setActiveView: (activeView: ActiveView) => void;
	layout: TaskLayoutKey;
	setLayout: (layout: TaskLayoutKey) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

/**
 * Stellt die aktuell aktive Ansicht (welcher Task-Ausschnitt: Projekt/
 * Inbox/Heute/Demnächst) und das aktuell gewählte Layout für den gesamten
 * Unterbaum bereit. Startet mit den Werten aus `defaultViewConfig` – ändert
 * sich danach nur noch durch explizite Nutzerinteraktion (Klick in der
 * Navigationsleiste, künftige Layout-Auswahl).
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
	const [activeView, setActiveView] = useState<ActiveView>(defaultViewConfig.activeView);
	const [layout, setLayout] = useState<TaskLayoutKey>(defaultViewConfig.layout);

	return (
		<NavigationContext.Provider value={{ activeView, setActiveView, layout, setLayout }}>
			{children}
		</NavigationContext.Provider>
	);
}

/** Zugriff auf `activeView`/`setActiveView`/`layout`/`setLayout` aus dem `NavigationContext`. Muss innerhalb eines `NavigationProvider` aufgerufen werden. */
export function useNavigation() {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error("useNavigation must be used within a NavigationProvider");
	}
	return context;
}
