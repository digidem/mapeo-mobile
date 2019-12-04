import React from "react";
import api from "../api";
import bugsnag from "../lib/logger";

let cachedDeviceId;

export default function useDeviceId() {
  const [deviceId, setDeviceId] = React.useState(cachedDeviceId);

  React.useEffect(() => {
    // No need to get the deviceId twice
    if (cachedDeviceId) return;
    api
      .getDeviceId()
      .then(deviceId => {
        setDeviceId(deviceId);
        cachedDeviceId = deviceId;
      })
      .catch(bugsnag.notify);
  }, []);

  return deviceId;
}
