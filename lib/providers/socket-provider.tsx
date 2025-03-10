"use client";

import { getNotificationUnreadRevalidate } from "@/services/notification";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DefaultEventsMap } from "socket.io";
import { io as ClientIO, Socket } from "socket.io-client";
import { toast } from "sonner";

type SocketContextType = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | any | null;
  isConnected: boolean;
  isOutdated: boolean;
  isFocus: boolean;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isOutdated: false,
  isFocus: false,
  setIsFocus: () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

const hostname =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.HOSTNAME || "https://easydivmy.danishnasarudin.com";

// const hostname = "http://localhost:3000";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOutdated, setIsOutdated] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const { session, isLoaded } = useSession();

  const sessionRef = useRef(session);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && session && !sessionRef.current) {
      sessionRef.current = session;
    }
  }, [session, isLoaded]);

  useEffect(() => {
    const socketInstance = ClientIO(hostname, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      query: sessionRef.current?.user.id
        ? { userId: sessionRef.current?.user.id }
        : undefined,
      withCredentials: true,
    });
    socketInstance.on("connect", () => {
      setIsConnected(true);
      setSocketId(socketInstance.id !== undefined ? socketInstance.id : "");
    });

    // console.log("USER", sessionRef.current);
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    socketInstance.on("connect_error", (err: any) => {
      // console.log(err.message);
      // console.log(err.description);
      // console.log(err.context);
      setTimeout(() => {
        socketInstance.connect();
      }, 1000);
    });

    socketInstance.on("receive-revalidate", async (data: any) => {
      //   console.log(
      //     "received",
      //     sessionRef.current?.user?.id,
      //     data.receiverId,
      //     sessionRef.current?.user?.id === data.receiverId
      //   );
      if (
        sessionRef.current?.user?.id &&
        sessionRef.current?.user?.id === data.receiverId
      ) {
        await getNotificationUnreadRevalidate();
        toast("New notification!", {
          action: {
            label: "View",
            onClick: () => router.push("/notification"),
          },
        });
      }
    });

    const clientVersion = process.env.NEXT_PUBLIC_APP_VERSION;

    socketInstance.on("version-check", (data: any) => {
      // console.log("Server version: ", data.serverVersion, clientVersion);
      socketInstance.emit("client-version", { clientVersion });
    });

    socketInstance.on("refresh-client", () => {
      setIsOutdated(true);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isLoaded]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, isOutdated, isFocus, setIsFocus }}
    >
      {children}
    </SocketContext.Provider>
  );
};
