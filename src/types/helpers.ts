export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type Values<T> = T[keyof T];
