import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
