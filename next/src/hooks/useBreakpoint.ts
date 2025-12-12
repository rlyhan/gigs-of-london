import { useState, useEffect } from 'react';

export const breakpoints = {
    phone: "(max-width: 767px)",
    tablet: "(min-width: 768px and max-width: 1024px)",
    desktop: "(min-width: 1025px)",
} as const;

type BreakpointKeys = keyof typeof breakpoints;

function useMediaQuery(query: string): boolean | undefined {
    const [matches, setMatches] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        media.addEventListener("change", listener);

        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}

export function useBreakpoint(breakpoint: BreakpointKeys): boolean | undefined {
    return useMediaQuery(breakpoints[breakpoint]);
}