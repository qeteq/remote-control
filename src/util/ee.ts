import { EventEmitter as EE } from 'events';

type Args<T> = T extends unknown[] ? T : [T];

/**
 * Generic typing for node native event emitter
 */
interface TypedEventEmitter<TMapping> {
  addListener<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  on<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  once<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  prependListener<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  prependOnceListener<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;

  removeListener<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  off<K extends keyof TMapping>(
    eventName: K,
    listener: (...args: Args<TMapping[K]>) => void
  ): this;
  removeAllListeners<K extends keyof TMapping>(event?: K): this;

  listeners<K extends keyof TMapping>(
    eventName: K
  ): (...args: Args<TMapping[K]>) => void;
  rawListeners<K extends keyof TMapping>(
    eventName: K
  ): (...args: Args<TMapping[K]>) => void;

  emit<K extends keyof TMapping>(
    eventName: K,
    ...args: Args<TMapping[K]>
  ): boolean;

  listenerCount<K extends keyof TMapping>(eventName: K): number;
  eventNames(): Array<keyof TMapping>;
}

type EventEmitterConstructor = { new <T>(): TypedEventEmitter<T> };

const EventEmitter = EE as unknown as EventEmitterConstructor;

export { EventEmitter };
export type { TypedEventEmitter };
