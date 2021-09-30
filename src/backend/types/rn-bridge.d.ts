declare module "rn-bridge" {
  import { TypedEmitter } from "tiny-typed-emitter";
  import { JsonValue } from "type-fest";

  interface AppEvents {
    pause: (pauseLock: { release: () => void }) => void;
    resume: () => void;
  }
  interface ChannelEvents {
    [eventName: string]: (message: any) => void;
  }
  interface App extends TypedEmitter<AppEvents> {
    datadir(): string;
  }
  interface Channel extends TypedEmitter<ChannelEvents> {
    send(message: JsonValue): void;
    post(event: string, ...message: any[]): void;
    emit(): never;
  }
  interface RnBridge {
    app: App;
    channel: Channel;
  }
  const rnBridge: RnBridge;
  export = rnBridge;
}
