import type {CSSProperties, ReactNode} from "react";
import { createPortal } from "react-dom";

/** Props für `Modal` – auch von `CreateTaskModal`/`ViewTaskModal` per `Pick<ModalProps, "open" | "onClose">` wiederverwendet. */
export interface ModalProps {
	open: boolean;
	onClose: () => void;
	children?: ReactNode;
	style?: CSSProperties;
}

/**
 * Generischer, wiederverwendbarer Overlay-Dialog. Kennt keinen fachlichen
 * Inhalt (nur `children`) – rendert bei `open === false` gar nichts (`null`),
 * sonst einen halbtransparenten Backdrop plus zentrierte Box. Klick auf den
 * Backdrop schließt (`onClose`); `e.stopPropagation()` in der Box verhindert,
 * dass Klicks im Inhalt das Event zum Backdrop durchsickern lassen.
 *
 * Wird per `createPortal` direkt als Kind von `document.body` gerendert,
 * statt an der Stelle im React-Baum, wo `Modal` benutzt wird (z.B. tief
 * verschachtelt in einem einzelnen `TaskItem` innerhalb einer Liste). Ohne
 * das Portal bleibt das `position: fixed`-Backdrop trotzdem an die
 * Stapelreihenfolge (Stacking Context) seines DOM-Elternteils gebunden –
 * bei mehreren Listen-Elementen kann dann ein früheres Geschwister-Element
 * über dem Modal eines späteren landen. Das Portal löst das Modal komplett
 * aus dieser Verschachtelung heraus, unabhängig davon, welches `TaskItem`
 * es geöffnet hat.
 */
export function Modal({ open, onClose, children, style }: ModalProps) {
	if (!open) {
		return null;
	}

	return createPortal(
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
				style={style}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
