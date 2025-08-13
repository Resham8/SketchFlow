"use client"
import { useEffect, useRef, useState } from "react";

import { Circle, Pencil, Square } from "lucide-react";
import { Board, Tool } from "../draw/Board";
import { IconButton } from "./IconButton";
import TopBar from "./ToolBar";


export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Board>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");

  useEffect(() => {
    board?.setTool(selectedTool);
  }, [selectedTool, board]);

  useEffect(() => {
    if (canvasRef.current) {
      const b = new Board(canvasRef.current, roomId, socket);
      setBoard(b);

      return () => {
        b.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
