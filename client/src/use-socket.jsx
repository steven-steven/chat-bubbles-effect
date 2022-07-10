import { useState, useEffect } from 'react'

const SOCKET_URL = "ws://localhost:3001/websockets";

const useSocket = () => {
  const initialWs = new WebSocket(SOCKET_URL);
  const [ws, setWs] = useState(initialWs);

  useEffect(() => {

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
