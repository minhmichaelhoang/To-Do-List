import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
	onClick: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	children?: ReactNode; // Optional property to allow developers to include another ReactNode or text on top of the button.
	style?: CSSProperties;
	/** Default `"button"`, damit ein `Button` innerhalb eines `<form>` nicht versehentlich als Submit-Trigger wirkt (das ist der native `<button>`-Default, sobald er in einem Formular liegt). Explizit `"submit"` setzen, wenn er wirklich submitten soll. */
	type?: "button" | "submit";
}

/**
 * Einfacher, wiederverwendbarer Button ohne CSS-Framework/Library – Styling
 * läuft über einen einzelnen `style`-Prop (Reacts `CSSProperties`), der mit
 * sinnvollen Defaults gemergt wird. Aufrufer können jede CSS-Eigenschaft
 * überschreiben, ohne dass `ButtonProps` für jede neue Eigenschaft wachsen
 * muss – und `CSSProperties` typisiert z.B. `position` bereits korrekt als
 * `"static" | "relative" | "absolute" | "fixed" | "sticky"` statt `string`.
 */
export function Button({ onClick, onMouseEnter, onMouseLeave, children, style, type = "button" }: ButtonProps) {
	return (
		<button
			type={type}
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
