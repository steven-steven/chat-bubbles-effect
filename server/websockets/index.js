const WebSocket = require("ws");

const websockets = (expressServer) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request)
    })
  })

  websocketServer.on(
    "connection",
    (websocketConnection, connectionRequest) => {
      
      websocketConnection.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);

        // broadcast message to all clients except sender
        websocketServer.clients.forEach((client => {
          if(client != websocketConnection && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        }))
        // websocketConnection.send(JSON.stringify({
        //   message: "there will be gold in them thar hills."
        // }))
      });

    }
  )


  return websocketServer;
}

module.exports = {
  websockets,
}