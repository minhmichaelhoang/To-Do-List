import type { ReactNode } from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children?: ReactNode;
}

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
				style={{
					backgroundColor: "white",
					borderRadius: "0.5rem",
					padding: "1.5rem",
					minWidth: "300px",
				}}
			>
				{children}
			</div>
		</div>
	);
}
