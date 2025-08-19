"use client";
import { useEffect, useRef, useState } from "react";
import { Board, Tool } from "../draw/Board";
import TopBar from "./ToolBar";
import MainMenu from "./MainMenu";

interface DrawingStyles {
  strokeColor: string;
  backgroundColor: string;
  fillStyle: "hachure" | "cross" | "solid" | null;
  strokeWidth: "thin" | "medium" | "thick" | null;
  strokeStyle: "solid" | "dashed" | "dotted" | null;
}

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
  const [drawingStyles, setDrawingStyles] = useState<DrawingStyles>({
    strokeColor: "#e4e4e4",
    backgroundColor: "url(/transparent.png)",
    fillStyle: "hachure",
    strokeWidth: "thin",
    strokeStyle: "solid",
  });
  useEffect(() => {
    board?.setTool(selectedTool);
    board?.setDrawingStyles(drawingStyles);
  }, [selectedTool,drawingStyles, board]);

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
      <MainMenu drawingStyles={drawingStyles} setDrawingStyles={setDrawingStyles}/>
    </div>
  );
}
