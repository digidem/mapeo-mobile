import { useCallback, useEffect, useRef } from "react";

export default function useIsMounted() {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => ref.current, []);
}
