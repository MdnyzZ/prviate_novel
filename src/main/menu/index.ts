import { Menu } from 'electron'

export const bookListItemRightClick = Menu.buildFromTemplate([
  { label: '删除', click: () => {
    console.log(333333333333333)
  } },
  { label: '详情' },
  { label: '目录' },
  { label: '详情' }
])
