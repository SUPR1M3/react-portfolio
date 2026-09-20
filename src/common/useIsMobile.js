import { useState, useEffect } from 'react';

// Matches the phone/tablet breakpoint most component CSS already uses
// (`max-width: 768px`). Below this width, App.jsx renders MobileLanding
// instead of the full horizontal-scroll desktop experience.
const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
    const query = `(max-width: ${breakpoint}px)`;
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(query).matches
    );

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const handleChange = (event) => setIsMobile(event.matches);

        setIsMobile(mediaQueryList.matches);
        mediaQueryList.addEventListener('change', handleChange);
        return () => mediaQueryList.removeEventListener('change', handleChange);
    }, [query]);

    return isMobile;
}
