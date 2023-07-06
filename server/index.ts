import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const wss = new WebSocketServer(8810);

wss.on("connection", function (ws: WebSocketClient) {

    ws.on("message", function (message: string) {
        console.log(message);
        broadcastEvent(message);
    });
});

const broadcastEvent = (message: string) => {
    wss.clients.forEach((ws: WebSocketClient) => {
        ws.send(message);
    });
}