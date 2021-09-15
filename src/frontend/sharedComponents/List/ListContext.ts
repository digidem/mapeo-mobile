import * as React from "react";

export const ListContext = React.createContext<{ dense?: boolean }>({});

if (process.env.NODE_ENV !== "production") {
  ListContext.displayName = "ListContext";
}
