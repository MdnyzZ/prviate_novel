const { ipcRenderer } = window.electron
import { IBookListResponse, IBooleanResponse } from '@commonTypes/apiTypes'
import { bookListParams } from '@commonTypes/apiRequest'

// 获取书籍列表
export function getBookListApi(params: bookListParams): Promise<IBookListResponse> {
  return ipcRenderer.invoke('/book/getList', params)
}

// 新增书籍
export function addBookApi(): Promise<IBooleanResponse> {
  return ipcRenderer.invoke('/book/add')
}

// 删除书籍
export function deleteBookApi(ids: string): Promise<IBooleanResponse> {
  return ipcRenderer.invoke('/book/del', ids)
}
