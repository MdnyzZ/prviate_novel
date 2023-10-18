import { IResponse } from './common'

// api 布尔
export type IBooleanResponse = IResponse<boolean>

// api any
export type IAnyResponse = IResponse<any>

export type listModeType<T> = {
  list?: T
  total?: number
  page?: number
  pageSize?: number
}

// api listmode
export type IListResponse<T> = IResponse<listModeType<T>>

export interface bookListType {
  id: number
  title: string
  image: string
  createTime: string
  path: string
  directory: string[]
}

// api bookList
export type IBookListResponse = IListResponse<bookListType[]>
