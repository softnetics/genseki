export type WithPrefix<T extends string | undefined, U extends string> = T extends string
  ? `${T}${U}`
  : U
