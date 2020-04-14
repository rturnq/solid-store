export { default as StoreProvider } from './components/StoreProvider';
export { StoreContext, useStore, createStoreHook } from './storeContext';
export * from './utils';
export * from './types';

// Workaround for Babel being unable to re-export types
import { AnyStore } from './types';
import * as StoreProvider from './components/StoreProvider';
export type StoreProviderProps<T extends AnyStore> = StoreProvider.Props<T>;
