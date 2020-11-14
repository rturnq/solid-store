import { untrack, createComputed, createSignal, batch } from 'solid-js';
import { Store, MappedStore, AnyStore } from './types';

export function createStore<S extends object, A extends object>(
  state: S,
  actions: A
): Store<S, A> {
  return [state, actions];
}

export function isStore<T extends AnyStore>(obj: any): obj is T {
  return Array.isArray(obj) && obj.length === 2;
}

export function combineStores<T extends AnyStore>(storeMap: MappedStore<T>): T {
  return Object.keys(storeMap).reduce(
    (store, k) => {
      const key = k as keyof T;
      store[0][key] = storeMap[key][0];
      store[1][key] = storeMap[key][1];
      return store;
    },
    [{}, {}] as T
  );
}

function normalizeError(err: unknown) {
  if (err == null) {
    return undefined;
  } else if (err instanceof Error) {
    return err;
  } else if (typeof err === 'object') {
    const errorObject = err as any;
    if ('message' in errorObject) {
      return new Error('' + errorObject.message);
    }
  } else {
    return new Error('' + err);
  }
  return new Error('Unknown error');
}

export function createAsyncComputed<T>(
  fn: () => Promise<T>
): [() => boolean, () => Error | undefined] {
  const [error, setError] = createSignal<Error | undefined>();
  const [isPending, setIsPending] = createSignal(false);

  createComputed(() => {
    if (!untrack(isPending)) {
      setIsPending(true);
      fn()
        .then(() => undefined)
        .catch(normalizeError)
        .then((err) => {
          batch(() => {
            setError(err);
            setIsPending(false);
          });
        });
    }
  });

  return [isPending, error];
}

export function delay<T>(data: T, ms: number): Promise<T>;
export function delay<T>(fn: () => T, ms: number): Promise<T>;
export function delay<T>(data: T | (() => T), ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const action = () => {
      if (typeof data === 'function') {
        const fn = data as () => T;
        try {
          resolve(fn());
        } catch (err) {
          reject(err);
        }
      } else {
        resolve(data);
      }
    };

    if (ms > 0) {
      setTimeout(action, ms);
    } else {
      action();
    }
  });
}
