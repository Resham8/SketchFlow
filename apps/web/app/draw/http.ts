import axios from "axios";
import { BACKEND_URL } from "../config";

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const chats = res.data.chats;

  const shapes = chats.map((chat: any) => {
    try {
      const parsed = JSON.parse(chat.shape);
      return parsed.shape;
    } catch (err) {
      console.error("Invalid JSON in message:", chat.shape);
      return null;
    }
  });

  return shapes.filter(Boolean);
}