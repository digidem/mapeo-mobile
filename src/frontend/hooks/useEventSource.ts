import { useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import "fast-text-encoding";

global.window = Object.assign(global.window || {}, {
  setTimeout,
  clearTimeout,
  fetch,
});

global.document = Object.assign(global.document || {}, {
  hidden: false,
  addEventListener: () => {},
  removeEventListener: () => {},
});

export const useEventSource = (endpoint: string | undefined) => {
  if (!endpoint) return;
  fetchEventSource(endpoint, {
    onmessage(ev) {
      console.log(ev);
    },
    onerror(err) {
      console.log("error", err);
    },
  });
};
