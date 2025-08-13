import { Circle, Pencil, Square } from "lucide-react";
import { IconButton } from "./IconButton";
import { Tool } from "../draw/Board";

export default function TopBar({
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
      <div className="flex gap-2  bg-[#232329] p-2 rounded-lg">
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