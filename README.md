# solid-store

A store pattern for [solid-js](https://github.com/ryansolid/solid)

## Getting Started

### Installation

```
> npm i @rturnq/solid-store
```

### Usage

Create one or more stores. Here is an example of creating one which is responsible for loading and storing `Foo` objects.

```tsx
// src/store/foo.ts

import { createResourceState } from 'solid-js';
import { Store } from '@rturnq/solid-store';

export interface Foo {
  // ...
}

export interface FooState {
  foos: Foo[]
}

export interface FooActions {
  loadFoos: () => Promise<void>
}

export type FooStore = Store<FooState, FooActions>;

export function createFooStore(): FooStore {
  const [state, loadState] = createResourceState<FooState>({
    foos: []
  });
  
  const actions: FooActions = {
    async loadFoos() {
      // `myApi.getFoos` is just some function that returns a Promise<Foo[]>
      const task = myApi.getFoos();

      // Note the task is not awaited yet, we want to pass the promise into the loadState function not the result
      loadState({ foos: task });

      await task;
    } 
  };

  return [state, actions];
}
```

Combine your stores into a single AppStore and optionally create a typed useStore hook

```tsx
// src/store/index.ts

import { CombinedStore, combineStores, createStoreHook } from '@rturnq/solid-store'
import { createFooStore, FooStore } from './foo';

export type AppStore = CombinedStore<{
  foo: FooStore
}>;

// Creates a hook that allows accesses to the store with the AppStore type 
export useStore = createStoreHook<AppStore>();

export createAppStore() {
  return combineStores<AppStore>({
    foo: createFooStore()
  });
}
```

Then wrap the root of you application with the store provider element with your store

```tsx
import { StoreProvider } from '@rturnq/solid-store';
import { createAppStore } from './store'

() => {
  const store = createAppStore();

  return (
    <StoreProvider store={store}>
      <MyApp />
    </StoreProvider>
  )
}
```

Access the store elsewhere in your application using your typed hook

```tsx
import { useStore } from 'src/store';

() => {
  const [state, actions] = useStore();

  return (
    // ...
  )
}
```


## API

### useStore
Access the router context provided by the `<RouterProvider>` component. If you want the store automatically typed to your app store's type, use `createStoreHook` to create a typed hook instead.

```typescript
useStore<T extends Store<any, any>>(): T

type Store<TState extends object, TActions extends object> = [TState, TActions]
```

### createStoreHook
Creates a hook to access the store which is typed. Generally this is used to create a store hook at the same time you create your store's type and then used throughout your application.

```typescript
createStoreHook<T extends Store<any, any>() => () => T
```

### combineStores
Combines multiple stores into a single one. Allows you to split your stores into smaller more granular objects. This can be used along with the CombinedStore type which combines multiple store types into a single type.

```typescript
type FooStore = Store<FooState, FooActions>;
type BarStore = Store<BarState, BarActions>;
type BazStore = Store<BazState, BazActions>;

interface FooBarBazStoreMap {
  foo: FooStore,
  bar: BarStore,
  baz: BazStore
}

type FooBarBazStore = CombinedStore<FooBarBazStoreMap>;

combineStores(map: FooBarBazStoreMap): FooBarBazStore
```

### createAsyncComputed
This is a useful way of calling async actions within your components and get access to the status and any error result. Creates an computation which runs an async function and returns two signals: whether the function is pending and the other with any error produced.

```typescript
export function createAsyncComputed<T>(
  fn: () => Promise<T>
): [() => boolean, () => Error | undefined]
```

Example

```tsx
() => {
  const [state, actions] = useStore();
  const [isLoading, error] = createAsyncComputed(() =>actions.foo.loadFoos());

  return (
    <Switch>
      <Match when={isLoading()}>Loading...</Match>
      <Match when={!!error()}>{error()!.message}</Match>
      <Match>
        <For each={state.foo.foos}>
          {(foo) => (
            //...
          )}
        </For>
      </Match>
    </Swtich>
  );
}

```

## Components

### \<StoreProvider>
Wraps your applcation with the store context

```typescript
Props<T extends Store<any, any>> {
  // Store object to provide to the application
  store: T;

  // Children
  children: JSX.Children;
}
```
