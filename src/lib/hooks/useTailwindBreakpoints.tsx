import { useCallback, useSyncExternalStore } from "react";

const LG_BREAKPOINT_PX = 1024;

const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export const useTailwindBreakpoints = () => {
  const isLg = useMediaQuery(`(min-width: ${LG_BREAKPOINT_PX}px)`);

  return { isLg };
};
