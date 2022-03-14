import { useContext } from "react";

import PermissionsContext from "../context/PermissionsContext";

export const usePermissions = () => useContext(PermissionsContext);
