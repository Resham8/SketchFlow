import { ReactElement } from "react";

export function IconButton({icon, onClick, activated}:{icon:ReactElement, onClick:() => void, activated:boolean}){
    return <div className={`cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-500 ${activated ? "text-red-500" : "text-white"}`} onClick={onClick}>
        {icon}
    </div>
}