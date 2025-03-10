import { NextAPIResponseServerIo } from "@/lib/types";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RowLocks = {
  [rowId: string]: number;
};

type UserLocks = {
  [socketId: string]: Set<string>;
};

const serverVersion = process.env.NEXT_PUBLIC_APP_VERSION;

const ioHandler = (req: NextApiRequest, res: NextAPIResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
      transports: ["polling"],
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? "https://easydivmy.vercel.app"
            : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", async (socket) => {
      //   const cook = await cookies();
      const userId = socket.handshake.query.userId as string | undefined;
      //   console.log(userId, "CHECK USER");

      if (userId) {
        socket.join(userId);
      }

      //   socket.on("join-group", (data) => {
      //     console.log("user joined", data);
      //   });

      socket.on("revalidate-notification", (data) => {
        // console.log("ITS TRIGGERED", data);
        io.to(data.receiverId).emit("receive-revalidate", data);
      });

      socket.on("disconnect", async () => {
        clearInterval(versionCheckInterval);
      });

      const versionCheckInterval = setInterval(() => {
        socket.emit("version-check", { serverVersion });
      }, 10000); // 10 secs

      socket.on("client-version", (data) => {
        const { clientVersion } = data;
        if (clientVersion !== serverVersion) {
          socket.emit("refresh-client", {
            message: "Client version is outdated. Please refresh.",
          });
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
