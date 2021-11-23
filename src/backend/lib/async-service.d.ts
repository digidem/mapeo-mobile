import {
  TypedEmitter,
  ListenerSignature,
  DefaultListener,
} from "tiny-typed-emitter";
import { AsyncServiceState } from "./types";

// This is done this way in a d.ts file with the same name as `async-service.js`
// since it is not possible to declare an abstract class in JSDoc, so by
// putting it in this file, the type is augmented with the type below when it
// is imported/required
declare abstract class AsyncService<
  Events extends ListenerSignature<Events> = DefaultListener,
  StartArgs extends Array<any> = []
> extends TypedEmitter<Events> {
  private _setState();
  protected getState(): AsyncServiceState;
  protected addStateListener(
    fn: (state: AsyncServiceState) => void
  ): () => void;
  protected removeStateListener(
    fn: (state: AsyncServiceState) => void
  ): () => void;
  start(...args: StartArgs): Promise<void>;
  stop(): Promise<void>;
  started(): Promise<void>;
  stopped(): Promise<void>;
  abstract _start(...args: StartArgs): Promise<void>;
  abstract _stop(): Promise<void>;
}

export = AsyncService;
