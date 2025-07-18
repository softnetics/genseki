interface GensekiUiCollectionHomeProps {
  cards: {
    path: string
    name: string
  }[]
}

export interface GensekiUiCommonProps {
  COLLECTION_HOME: GensekiUiCollectionHomeProps
  AUTH_LOGIN: {}
  AUTH_SIGNUP: {}
  AUTH_FORGOT_PASSWORD: {}
  AUTH_RESET_PASSWORD: {}
}

export const GensekiUiCommonId = {
  COLLECTION_HOME: 'COLLECTION_HOME',
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FORGOT_PASSWORD: 'AUTH_FORGOT_PASSWORD',
  AUTH_RESET_PASSWORD: 'AUTH_RESET_PASSWORD',
} as const satisfies Record<keyof GensekiUiCommonProps, string>
export type GensekiUiCommonId = (typeof GensekiUiCommonId)[keyof typeof GensekiUiCommonId]
