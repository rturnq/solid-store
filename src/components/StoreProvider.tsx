import { StoreContext } from '../storeContext';
import { AnyStore } from '../types';

export interface Props<T extends AnyStore> {
  store: T;
  children: JSX.Children;
}

export default function <T extends AnyStore>(props: Props<T>) {
  return (
    <StoreContext.Provider value={props.store}>
      {props.children}
    </StoreContext.Provider>
  );
}
