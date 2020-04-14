export type Store<S extends object, A extends object> = [S, A];

export type AnyStore = Store<any, any>;

export type CombinedStore<
  T extends {
    [key: string]: Store<any, any>;
  }
> = Store<{ [P in keyof T]: T[P][0] }, { [P in keyof T]: T[P][1] }>;

export type MappedStore<T extends AnyStore> = {
  [P in keyof T[0]]: Store<T[0][P], T[1][P]>;
};
