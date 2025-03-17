import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement = any>(handler: () => void) {
  // events that trigger the function
  const events = ["mousedown", "touchstart"];
  const ref = useRef<T>(null);

  useEffect(() => {
    const eventListener = (event: any) => {
      if (!ref.current) return;

      const isClickedElementOutsideOfRef = !ref.current.contains(event.target);
      if (isClickedElementOutsideOfRef) {
        handler();
      }
    };

    events.forEach((event) => document.addEventListener(event, eventListener));

    return () => {
      events.forEach((event) => document.removeEventListener(event, eventListener));
    };
  }, [ref, handler]);

  return ref;
}
