import { createContext, useEffect } from "react";
import socket from "../components/Socket";

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("Connected:", socket.id));

    return () => {
      socket.disconnect();
      console.log("socket disconnected on app unmount");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
