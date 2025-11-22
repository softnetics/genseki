export const AccountProvider = {
  CREDENTIAL: 'credential',
}
export type AccountProvider = (typeof AccountProvider)[keyof typeof AccountProvider]
