interface GensekiUiCollectionHomeProps {
  cards: {
    path: string
    name: string
  }[]
}

export interface GensekiUiCommonProps {
  COLLECTIONS_HOME: GensekiUiCollectionHomeProps
  AUTH_LOGIN: {}
  AUTH_SIGNUP: {}
  AUTH_FORGOT_PASSWORD: {}
  AUTH_RESET_PASSWORD: {}
}

export const GensekiUiCommonId = {
  COLLECTIONS_HOME: 'COLLECTIONS_HOME',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FORGOT_PASSWORD: 'AUTH_FORGOT_PASSWORD',
  AUTH_RESET_PASSWORD: 'AUTH_RESET_PASSWORD',
} as const satisfies Record<keyof GensekiUiCommonProps, string>
export type GensekiUiCommonId = (typeof GensekiUiCommonId)[keyof typeof GensekiUiCommonId]
