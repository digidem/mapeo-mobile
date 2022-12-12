declare module "rn-bridge" {
  interface Channel {
    on(event: string, callback: (message: any) => void): void;
    post(event: string, message: any): void;
    send(message: any): void;
  }
  interface App {
    on(
      event: "pause",
      callback: (pauseLock: { release: () => void }) => void
    ): void;
    on(event: "resume", callback: () => void): void;
    datadir(): string;
  }
  interface RNBridge {
    channel: Channel;
    app: App;
  }
  const rnBridge: RNBridge;
  export = rnBridge;
}
