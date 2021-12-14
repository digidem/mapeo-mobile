import { useEffect, useState, useRef } from "react";
import debug from "debug";

import api, { Constants, ServerStatus } from "../api";

const log = debug("mapeo:useServerStatus");

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>(api.getServerStatus());
  const startedRef = useRef(api.getServerStatus() !== Constants.IDLE);

  useEffect(() => {
    const onStatusChange = (newServerStatus: ServerStatus) => {
      setStatus(previous => {
        if (previous === newServerStatus) {
          return previous;
        } else {
          log("status change", newServerStatus);
          return newServerStatus;
        }
      });
    };

    const stateSubscription = api.addServerStateListener(onStatusChange);

    return () => stateSubscription.remove();
  }, []);

  useEffect(() => {
    if (!startedRef.current) {
      api.startServer();
      startedRef.current = true;
    }
  }, []);

  return status;
};
