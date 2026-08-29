import { useEffect, useState } from "react";

/** Liefert `true`, solange die übergebene Media Query zutrifft, und reagiert live auf Fenstergrößenänderung/Rotation. */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

	useEffect(() => {
		const mediaQueryList = window.matchMedia(query);
		const listener = () => setMatches(mediaQueryList.matches);

		listener();
		mediaQueryList.addEventListener("change", listener);
		return () => mediaQueryList.removeEventListener("change", listener);
	}, [query]);

	return matches;
}
