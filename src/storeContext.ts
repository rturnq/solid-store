import { createContext, useContext } from 'solid-js';
import { AnyStore } from './types';

export const StoreContext = createContext<AnyStore>([{}, {}]);

export const useStore = <T extends AnyStore>() =>
  useContext<T>(StoreContext as any);

export const createStoreHook = <T extends AnyStore>(): (() => T) => useStore;
