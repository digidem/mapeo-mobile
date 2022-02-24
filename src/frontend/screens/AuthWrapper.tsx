import * as React from "react";
import { createAppContainer } from "react-navigation";
import AppContainerWrapper from "../AppContainerWrapper";
import { SecurityContext } from "../context/SecurityContext";
import { AuthStack } from "../Navigation/AuthStack";

const AuthContainer = createAppContainer(AuthStack);

export const AuthWrapper = () => {
  const [{ authStatus }] = React.useContext(SecurityContext);

  if (authStatus === "pending") {
    return <AuthContainer />;
  }

  return <AppContainerWrapper />;
};
