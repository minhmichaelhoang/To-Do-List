import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AddButton() {
	return (
		<Button className="h-8 w-8 rounded-lg bg-amber-400 text-gray-600 hover:bg-amber-400/80">
			<Plus />
		</Button>
	)
}
