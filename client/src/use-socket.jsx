import { useState, useEffect } from 'react'

const SOCKET_URL = "ws://localhost:3001/websockets";

const useSocket = () => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if(!ws){
      setWs(new WebSocket(SOCKET_URL));
      return;
    }

    const onClose = () => {
      setTimeout(() => {
        setWs(new WebSocket(SOCKET_URL));
      }, 3000);
    };
    ws.addEventListener("close", onClose);

    return () => {
      ws.removeEventListener("close", onClose);
    }
  }, [ws, setWs])

  return ws
}

export default useSocket
