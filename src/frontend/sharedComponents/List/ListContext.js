import React from "react";

const ListContext = React.createContext({});

if (process.env.NODE_ENV !== "production") {
  ListContext.displayName = "ListContext";
}

export default ListContext;
