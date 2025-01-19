// server/src/services/coinbaseProService.ts
import WebSocket from "ws";
import { Server, Socket } from "socket.io";

const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

ws.on("open", () => {
  console.log("Connected to Coinbase Pro WebSocket");
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  if (message.type === "subscriptions") {
    io.emit("systemStatus", message.channels);
  } else if (message.type === "l2update") {
    io.emit("priceUpdate", message);
  } else if (message.type === "match") {
    io.emit("matchUpdate", message);
  }
});

export const coinbaseProService = {
  subscribe: (productId: string, socket: Socket) => {
    const subscribeMessage = {
      type: "subscribe",
      product_ids: [productId],
      channels: ["level2", "matches"],
    };
    ws.send(JSON.stringify(subscribeMessage));
  },
  unsubscribe: (productId: string, socket: Socket) => {
    const unsubscribeMessage = {
      type: "unsubscribe",
      product_ids: [productId],
      channels: ["level2", "matches"],
    };
    ws.send(JSON.stringify(unsubscribeMessage));
  },
};
