export interface openBroswerViewParams {
  x: number
  y: number
  width: number
  height: number
  url: string
}

export enum browserOptParamsType {
  VIEW = 'view',
  WINDOW = 'window'
}
export enum browserOptParamsOpt {
  BACK = 'back',
  FORWARD = 'forward'
}
export interface browserOptParams {
  type: browserOptParamsType
  opt: browserOptParamsOpt
}

export interface browserOptResult {
  canGoBack: boolean
  canGoForward: boolean
}

export interface analysisMenuType {
  src: string
  title: string
  sort: number
}
