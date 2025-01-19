// server/src/services/__tests__/coinbaseProService.test.ts
import { coinbaseProService } from "../coinbaseProService";
import WebSocket from "ws";
import { Server, Socket } from "socket.io";

jest.mock("ws");
jest.mock("socket.io");

describe("CoinbaseProService", () => {
  let wsMock: jest.Mocked<WebSocket>;
  let ioMock: jest.Mocked<Server>;
  let socketMock: jest.Mocked<Socket>;

  beforeEach(() => {
    wsMock = new WebSocket(
      "wss://ws-feed.pro.coinbase.com"
    ) as jest.Mocked<WebSocket>;
    ioMock = new Server() as jest.Mocked<Server>;
    socketMock = {} as jest.Mocked<Socket>;
  });

  it("should send a subscribe message", () => {
    coinbaseProService.subscribe("BTC-USD", socketMock);
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2", "matches"],
      })
    );
  });

  it("should send an unsubscribe message", () => {
    coinbaseProService.unsubscribe("BTC-USD", socketMock);
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "unsubscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2", "matches"],
      })
    );
  });
});
