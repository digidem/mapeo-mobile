import { useEffect, useRef } from "react";

// Gregor TODO: Add method to API for (un)subscribing to project invites
const subscribeToProjectInvites = (callback: (inviteKey: string) => void) => {
  const intervalId = setInterval(() => callback("abc123"), 3000);
  return () => clearInterval(intervalId);
};

export default function useProjectInviteListener(
  onInviteReceived: (inviteKey: string) => void
) {
  const callbackRef = useRef(onInviteReceived);

  useEffect(() => {
    callbackRef.current = onInviteReceived;
  }, [onInviteReceived]);

  useEffect(() => {
    const handleInvite = (key: string) => callbackRef.current(key);
    const unsubscribe = subscribeToProjectInvites(handleInvite);

    return () => unsubscribe();
  }, []);
}
