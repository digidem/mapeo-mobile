import * as React from "react";
import { SecurityContext } from "../context/SecurityContext";

export const useAuthState = () => React.useContext(SecurityContext).authState;
