import {
  TypedEmitter,
  ListenerSignature,
  DefaultListener,
} from "tiny-typed-emitter";
import { AsyncServiceStateDefault } from "./types";

// This is done this way in a d.ts file with the same name as `async-service.js`
// since it is not possible to declare a class with Generics in JSDoc, so by
// putting it in this file, the type is augmented with the type below when it
// is imported/required
declare abstract class AsyncService<
  Events extends ListenerSignature<Events> = DefaultListener,
  StartArgs extends Array<any> = [],
  State extends AsyncServiceStateDefault = AsyncServiceStateDefault
> extends TypedEmitter<Events> {
  getState(): State;
  setState(newState: State): void;
  start(...args: StartArgs): Promise<void>;
  stop(): Promise<void>;
  started(): Promise<void>;
  stopped(): Promise<void>;
  abstract _start(...args: StartArgs): Promise<void>;
  abstract _stop(): Promise<void>;
}

export = AsyncService;
