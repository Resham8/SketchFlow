"use client"

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { WS_URL } from "../config";

export default function RoomCanvas({roomId}:{roomId : string}) {  
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem('token')}`);
    ws.onopen = () => {
        setSocket(ws);
        ws.send(JSON.stringify({
          type:"join_room",
          roomId:Number(roomId)
        }))
    }
  },[])

 
  if(!socket){
    return <div>
        Connection to the server.............
    </div>
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  );
}
