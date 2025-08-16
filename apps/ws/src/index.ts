import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
  ws: WebSocket;
  rooms: number[];
  userId: string;
}

const users: Users[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token as string, JWT_SECRET as string);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  const userId = checkUser(String(token));

  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    let parseData;

    if (typeof data !== "string") {
      parseData = JSON.parse(data.toString());
    } else {
      parseData = JSON.parse(data);
    }

    if (parseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(Number(parseData.roomId));
    }

    if (parseData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }

      user.rooms = user.rooms.filter((x) => x === parseData.room);
    }

    if (parseData.type === "chat") {
      const roomId = Number(parseData.roomId);
      const shape = parseData.shape;
const shapeString = JSON.stringify(shape);
      const response = await prismaClient.element.create({
        data: {
          shape:shapeString,
          user: {
            connect: {
              id: userId,
            },
          },
          room: {
            connect: {
              id: Number(roomId),
            },
          },
        },
      });

      const shapeWithId = { ...shape, id: response.id };

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              shape: shapeWithId,
              shapeId: response.id,
              roomId,
            })
          );
        }
      });
    }

    if (parseData.type === "delete") {
      const roomId = Number(parseData.roomId);
      const shapeId = Number(parseData.shapeId);

      try {
        await prismaClient.element.delete({
          where: {
            id: shapeId,
            roomId: roomId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({ type: "delete", shapeId: parseData.shapeId })
            );
          }
        });
      } catch (error) {
        console.error("Error deleting shape:", error);
      }
    }
  });
});
