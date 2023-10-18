
export interface AnyObject {
  [key: string]: any;
}

// api 正常响应
export interface INormalResponse<T> {
  /** 响应码 */
  code?: number
  /** 服务器处理标识，成功/失败 */
  success?: boolean
  /** 服务器消息 */
  msg?: string
  /** 数据 */
  data?: T
}

// api 响应
export type IResponse<T> = INormalResponse<T>