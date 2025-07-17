export const Fruits = {
  Apple: 'Apple',
  Banana: 'Banana',
  Orange: 'Orange',
  Pear: 'Pear',
} as const

export type Fruits = (typeof Fruits)[keyof typeof Fruits]
