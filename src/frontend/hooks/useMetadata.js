// @flow
import { useContext } from "react";

import PresetsContext from "../context/PresetsContext";

export default (): { projectKey?: string } => {
  const [{ metadata }] = useContext(PresetsContext);
  return metadata;
};
