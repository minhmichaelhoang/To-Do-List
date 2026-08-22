import type { ReactNode } from "react";

// Notwendig, für Typen der Parameterliste; Unterscheidung von Typ und Logik
interface ButtonProps {
	color?: string;
	children?: ReactNode; // Optional property to allow developers to include another ReactNode or text on top of the button.
	height?: string;
	width?: string;
	onClick: () => void;
	radius?: string;
	padding?: string;
}

// color ist optional, falls kein Wert zugewiesen wird, nimm "#de483a"
export function Button({
	color = "#de483a",
	children,
	height,
	width,
	onClick,
	radius = "0.5rem",
	padding = "0.5rem",
}: ButtonProps) {
	return (
		<button
			onClick={onClick}
			style={{
				backgroundColor: color,
				borderRadius: radius,
				height,
				width,
				padding,
			}}
		>
			{children}
		</button>
	);
}
