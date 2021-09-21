import { createContext } from "react";

export const ListContext = createContext<{ dense?: boolean }>({});

if (process.env.NODE_ENV !== "production") {
  ListContext.displayName = "ListContext";
}
