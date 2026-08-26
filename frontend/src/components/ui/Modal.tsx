import type { ReactNode } from "react";

/** Props für `Modal` – auch von `CreateTaskModal`/`ViewTaskModal` per `Pick<ModalProps, "open" | "onClose">` wiederverwendet. */
export interface ModalProps {
	open: boolean;
	onClose: () => void;
	children?: ReactNode;
}

/**
 * Generischer, wiederverwendbarer Overlay-Dialog. Kennt keinen fachlichen
 * Inhalt (nur `children`) – rendert bei `open === false` gar nichts (`null`),
 * sonst einen halbtransparenten Backdrop plus zentrierte Box. Klick auf den
 * Backdrop schließt (`onClose`); `e.stopPropagation()` in der Box verhindert,
 * dass Klicks im Inhalt das Event zum Backdrop durchsickern lassen.
 */
export function Modal({ open, onClose, children }: ModalProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={"container"}
			>
				{children}
			</div>
		</div>
	);
}
