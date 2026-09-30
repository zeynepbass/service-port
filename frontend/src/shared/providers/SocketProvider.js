"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { refreshSession } from "@/shared/api/client";
import { clientEnv } from "@/shared/config/env";

const SocketContext = createContext(null);
const MAX_AUTH_RETRIES = 2;

export function SocketProvider({ enabled = true, children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;

    let authRetries = 0;
    const instance = io(clientEnv.socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    instance.on("connect", () => {
      authRetries = 0;
    });

    instance.on("connect_error", async (error) => {
      if (error.message !== "UNAUTHORIZED" || authRetries >= MAX_AUTH_RETRIES) return;
      authRetries += 1;
      try {
        await refreshSession();
        instance.connect();
      } catch {
        instance.disconnect();
      }
    });

    setSocket(instance);

    return () => {
      instance.removeAllListeners();
      instance.disconnect();
      setSocket(null);
    };
  }, [enabled]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
