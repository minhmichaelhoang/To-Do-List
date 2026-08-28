import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
	onClick: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	children?: ReactNode; // Optional property to allow developers to include another ReactNode or text on top of the button.
	style?: CSSProperties;
}

/**
 * Einfacher, wiederverwendbarer Button ohne CSS-Framework/Library – Styling
 * läuft über einen einzelnen `style`-Prop (Reacts `CSSProperties`), der mit
 * sinnvollen Defaults gemergt wird. Aufrufer können jede CSS-Eigenschaft
 * überschreiben, ohne dass `ButtonProps` für jede neue Eigenschaft wachsen
 * muss – und `CSSProperties` typisiert z.B. `position` bereits korrekt als
 * `"static" | "relative" | "absolute" | "fixed" | "sticky"` statt `string`.
 */
export function Button({ onClick, onMouseEnter, onMouseLeave, children, style }: ButtonProps) {
	return (
		<button
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			className={"button"}
			style={{...style}}
		>
			{children}
		</button>
	);
}
