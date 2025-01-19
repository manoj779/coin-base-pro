// src/services/__tests__/coinbaseProService.test.ts
import WebSocket from "ws";
import { createCoinbaseProService } from "../coinbaseProService";

jest.mock("ws");

describe("CoinbaseProService", () => {
  let wsMock: jest.Mocked<WebSocket>;
  let coinbaseProService: ReturnType<typeof createCoinbaseProService>;

  beforeEach(() => {
    // Mock the WebSocket instance
    wsMock = new WebSocket(
      "wss://ws-feed.pro.coinbase.com"
    ) as jest.Mocked<WebSocket>;
    (wsMock.send as jest.Mock) = jest.fn();

    // Create the service with the mocked WebSocket
    coinbaseProService = createCoinbaseProService(wsMock);
  });

  it("should send a subscribe message", () => {
    coinbaseProService.subscribe("BTC-USD", {} as any);
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2", "matches"],
      })
    );
  });

  it("should send an unsubscribe message", () => {
    coinbaseProService.unsubscribe("BTC-USD", {} as any);
    expect(wsMock.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "unsubscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2", "matches"],
      })
    );
  });
});
