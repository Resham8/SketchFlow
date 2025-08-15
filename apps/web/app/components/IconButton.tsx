import { ReactElement } from "react";

export function IconButton({icon,onClick,activated,className}: {
  icon: ReactElement;
  onClick: () => void;
  activated: boolean;
  className?:string;
}) {
  return (
    <div
      className={`cursor-pointer rounded-lg p-2 text-white  hover:bg-gray-700 ${activated ? "bg-[#8d8bc0]" : "text-white"} ${className}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
