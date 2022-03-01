import * as React from "react";
import AppContainerWrapper from "../AppContainerWrapper";
import { SecurityContext } from "../context/SecurityContext";
import { AuthScreen } from "./AuthScreen";

export const AuthWrapper = () => {
  const [{ authStatus }] = React.useContext(SecurityContext);

  if (authStatus === "pending") {
    return <AuthScreen />;
  }

  return <AppContainerWrapper />;
};
