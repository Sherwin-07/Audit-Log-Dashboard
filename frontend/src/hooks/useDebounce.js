import { useEffect, useState } from "react";

/**
 * Returns `value`, but only updates after `delayMs` of no further changes.
 * Used on the search input so keystrokes don't each fire a server request.
 */
export function useDebounce(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
