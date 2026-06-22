import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  const [connectionType, setConnectionType] = useState<
    "unknown" | "wifi" | "cellular" | "ethernet" | "none" | "other"
  >("unknown");
  const [effectiveType, setEffectiveType] = useState<
    "unknown" | "2g" | "3g" | "4g" | "5g"
  >("unknown");
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(
    null,
  );
  const [hasStrongSignal, setHasStrongSignal] = useState(false);
  const [signalLabel, setSignalLabel] = useState("Checking...");

  useEffect(() => {
    let active = true;

    const setOfflineState = (offline: boolean) => {
      if (active) {
        setIsOffline(offline);
      }
    };

    const setOnlineDefaults = () => {
      if (!active) return;
      setOfflineState(false);
      setConnectionType("unknown");
      setEffectiveType("unknown");
      setIsInternetReachable(true);
      setHasStrongSignal(true);
      setSignalLabel("Online");
    };

    setOnlineDefaults();

    return () => {
      active = false;
    };
  }, []);

  return {
    isOffline,
    connectionType,
    effectiveType,
    isInternetReachable,
    hasStrongSignal,
    signalLabel,
  };
}
