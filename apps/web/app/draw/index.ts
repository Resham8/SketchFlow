import axios from "axios";
import { BACKEND_URL } from "../config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  const existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      console.log(message);
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    // @ts-ignore
    const selectedTool = window.selectedTool;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      };
      existingShapes.push(shape);
    } else if (selectedTool === "circle") {
      const centerX = startX + width / 2;
      const centerY = startY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;

      shape = {
        type: "circle",
        radius,
        centerX,
        centerY,
      };
      existingShapes.push(shape);
    }

    if (!shape) {
      return;
    }

    socket.send(
      JSON.stringify({
        roomId: roomId,
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255,255,255)";
      //@ts-ignore
      const selectedTool = window.selectedTool;
      if (selectedTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "circle") {
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (!shape) return;

    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      const { centerX, centerY, radius } = shape;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const chats = res.data.chats;

  const shapes = chats.map((chat: any) => {
    try {
      const parsed = JSON.parse(chat.message);
      return parsed.shape;
    } catch (err) {
      console.error("Invalid JSON in message:", chat.message);
      return null;
    }
  });

  return shapes.filter(Boolean);
}
