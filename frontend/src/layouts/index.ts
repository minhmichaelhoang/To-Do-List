import { ListLayout } from "./ListLayout.tsx";

/** Registry aller wählbaren Ansichten zur Task-Darstellung – neue Ansichten (z.B. ein Board) hier ergänzen. */
export const taskLayouts = {
	list: ListLayout,
} as const;

export type TaskLayoutKey = keyof typeof taskLayouts;
