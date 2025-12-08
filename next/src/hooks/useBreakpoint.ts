import { useState, useEffect } from 'react';

export const breakpoints = {
    phone: "(max-width: 767px)",
    tablet: "(max-width: 1024px)",
    desktop: "(min-width: 1025px)",
} as const;

type BreakpointKeys = keyof typeof breakpoints;

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}

export function useBreakpoint(breakpoint: BreakpointKeys): boolean {
    return useMediaQuery(breakpoints[breakpoint]);
}