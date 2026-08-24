import type { ReactNode } from "react";

// Notwendig, für Typen der Parameterliste; Unterscheidung von Typ und Logik
interface ButtonProps {
	color?: string;
	borderColor?: string;
	children?: ReactNode; // Optional property to allow developers to include another ReactNode or text on top of the button.
	height?: string;
	width?: string;
	onClick: () => void;
	radius?: string;
	padding?: string;
	margin?: string;
	display?: string;
	justifyContent?: string;
	alignItems?: string;
}

/**
 * Einfacher, wiederverwendbarer Button ohne CSS-Framework/Library –
 * Styling läuft komplett über Inline-Style-Props (`color`, `padding`, ...)
 * mit sinnvollen Defaults, statt über Tailwind-Klassen oder eine
 * Variant-Bibliothek wie `cva`. `height`/`width` bleiben standardmäßig
 * `undefined`, damit sich die Größe nach Inhalt + `padding` richtet, statt
 * fest vorgegeben zu sein.
 */
export function Button({
	color = "#de483a",
	borderColor,
	children,
	height,
	width,
	onClick,
	radius = "0.5rem",
	padding = "0.5rem",
	margin = "0.5rem",
	display = "flex",
	justifyContent = "center",
	alignItems = "center"
}: ButtonProps) {
	return (
		<button
			onClick={onClick}
			style={{
				backgroundColor: color,
				borderRadius: radius,
				border: borderColor ? `1px solid ${borderColor}` : "none",
				height,
				width,
				padding,
				margin,
				display,
				justifyContent,
				alignItems,
			}}
		>
			{children}
		</button>
	);
}
