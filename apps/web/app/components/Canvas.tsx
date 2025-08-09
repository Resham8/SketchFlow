import { useEffect, useRef, useState } from "react";

import { Circle, Pencil, Square } from "lucide-react";
import { Board, Tool } from "../draw/Board";
import { IconButton } from "./IconButton";


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

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
      className="flex justify-center w-full"
    >
      <div className="flex gap-2 border border-gray-600 p-3 rounded-lg">
        <IconButton
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool("pencil");
          }}
        />
        <IconButton
          activated={selectedTool === "rect"}
          icon={<Square />}
          onClick={() => {
            setSelectedTool("rect");
          }}
        />
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle />}
          onClick={() => {
            setSelectedTool("circle");
          }}
        />
      </div>
    </div>
  );
}
