const fs = require('fs')
const os = require('os')
const path = require('path')
import { ipcMain, dialog, app } from 'electron'
import { tocRules } from '../common/index'
import { addBookList, getBookList } from '../sql/sql-api/bookList'

let bookStorePath = path.join(app.getAppPath(), '/resources/book')

// 内部使用API
export const initIpcMainHandle = () => {
  // 读取txt
  ipcMain.handle('getFiles', async function (_event, path) {
    const result = await fs.readFileSync(path, 'utf8')

    return result.split(os.EOL)
  })

  // 导入书籍
  ipcMain.handle('importBook', async function () {
    // 选择要读取的文件
    const dialogResult = await dialog.showOpenDialog({
      title: '选择导入的文件',
      filters: [{ name: 'txt', extensions: ['txt'] }],
      properties: ['openFile'],
      message: '选择导入的文件、目前仅支持txt格式'
    })

    // 读取的文件路径
    const filePath = dialogResult.filePaths[0]

    // 选中了对应的文件
    if (!dialogResult.canceled && filePath) {
      const arr = filePath.split('/')
      const title = arr[arr.length - 1]?.split('.')?.[0]
      const bookCtn = await fs.readFileSync(filePath, 'utf8')
      // 匹配合适的正则
      const reg = tocRules.find((item) => new RegExp(item, 'm').test(bookCtn))
      const fileDer = `${bookStorePath}/${title}`
      if (reg) {

        const menu = bookCtn.match(new RegExp(reg, 'mg'))?.map((item) => item.trim())
        const result = await addBookList({
          title,
          path: fileDer,
          directory: JSON.stringify(menu || [])
        })
        // 生成章节的目录
        let menuLen = menu?.length
        let optData = bookCtn
        // 创建目录
        await fs.mkdirSync(fileDer, { recursive: true })

        menu.forEach(async (nowPart, index) => {
          let _last = optData.split(nowPart)[1] || ''
          let nextPart = menu[index + 1] || ''
          let ctn = ''

          if (_last.length) {
            if (index + 1 > menuLen) {
              // 最后一个章节
              ctn = _last
            } else {
              // 不是最后的章节
              ctn = _last.split(nextPart)[0]
            }
          }
          optData = _last
          if (ctn) {
            await fs.appendFileSync(`${fileDer}/${nowPart}.txt`, ctn)
          }
        })

        return result
      } else {
        return {
          success: false,
          msg: '书籍新增异常，错误：目录匹配失败'
        }
      }
    }

    if (dialogResult.canceled) {
      // 取消了，啥都不用功处理
      return ''
    } else if (!filePath) {
      // 没选择文件
      return ''
    } else {
      return ''
    }
  })

  // 获取文件列表
  ipcMain.handle('getBookList', async function (_event, { page = 1, pageSize = 10, id = '' }) {
    const params = {
      page,
      pageSize,
      id
    }
    const result = await getBookList(params)
    return result
  })
}
