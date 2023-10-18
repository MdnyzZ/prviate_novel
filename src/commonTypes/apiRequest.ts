export interface bookListParams {
  page: number
  pageSize: number
  id?: number
}

export interface bookAddParams {
  title: string
  image?: string
  path: string
  directory: string
}
