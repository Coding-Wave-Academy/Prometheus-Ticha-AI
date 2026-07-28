import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Idiomatic React 19 hook to check if component is mounted on client.
 * Uses useSyncExternalStore (server snapshot = false, client snapshot = true)
 * avoiding setState in useEffect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
