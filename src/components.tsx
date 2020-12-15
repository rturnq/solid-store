import { createContext, useContext, JSX } from 'solid-js';
import { AnyStore } from './types';

export const StoreContext = createContext<AnyStore>([{}, {}]);

export const useStore = <T extends AnyStore>() =>
  useContext<T>(StoreContext as any);

export const createStoreHook = <T extends AnyStore>(): (() => T) => useStore;

export interface StoreProviderProps<T extends AnyStore> {
  store: T;
  children: JSX.Element;
}

export function StoreProvider<T extends AnyStore>(
  props: StoreProviderProps<T>
) {
  return (
    <StoreContext.Provider value={props.store}>
      {props.children}
    </StoreContext.Provider>
  );
}
