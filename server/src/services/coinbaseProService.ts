// src/services/coinbaseProService.ts
import { Socket } from "socket.io";
import WebSocket from "ws";
import { io } from "../app";

export const createCoinbaseProService = (ws: WebSocket) => {
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

  return {
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
};

// Default service using a real WebSocket instance
export const coinbaseProService = createCoinbaseProService(
  new WebSocket("wss://ws-feed.pro.coinbase.com")
);
