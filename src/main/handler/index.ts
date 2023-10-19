const fs = require('fs')
const os = require('os')
const path = require('path')
import { ipcMain, dialog, app, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { tocRules } from '../common/index'
import { addBookList, getBookList, delBookList } from '../sql/sql-api/bookList'
import { bookListParams } from '@commonTypes/apiRequest'
import { bookListItemRightClick } from '../menu'

let bookStorePath = path.join(app.getAppPath(), '/resources/book')

// 内部使用API
export const initIpcMainHandle = () => {
  // 读取txt
  // todo 判断文件的编码格式，转码成utf-8的字符串后返回出去
  ipcMain.handle('getFiles', async function (_event, path: string): Promise<string> {
    const result = await fs.readFileSync(path, 'utf8')

    return result.split(os.EOL)
  })

  // bookRight
  ipcMain.handle('bookRightClick', function () {
    bookListItemRightClick.popup()
  })

  ipcMain.handle('openThiefBookWindow', function (_event, id) {
    // 生成一个子窗口
    let thiefBookWindows = new BrowserWindow({
      width: 400,
      height: 470,
      autoHideMenuBar: true,
      frame: false,
      transparent: true,
      resizable: true,
      movable: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      thiefBookWindows.loadURL(process.env['ELECTRON_RENDERER_URL'] + `#/thiefBookReader?id=${id}`)
      // thiefBookWindows.webContents.openDevTools()
    } else {
      thiefBookWindows.loadFile(
        path.join(
          __dirname,
          '../renderer/index.html#/thiefBookReader' + `#/thiefBookReader?id=${id}`
        )
      )
    }
  })

  ipcMain.handle('setHasShadow', function (_event, wins) {
    const bol = wins.hasShadow()
    wins.setHasShadow(!bol)
  })

  // book模块
  // 导入书籍
  ipcMain.handle('/book/add', async function () {
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
            if (index + 1 >= menuLen) {
              // 最后一个章节
              ctn = _last
            } else {
              // 不是最后的章节
              ctn = _last.split(nextPart)[0]
            }
          }
          if (ctn) {
            await fs.appendFileSync(`${fileDer}/${nowPart}.txt`, ctn)
          } else {
            console.log(nowPart, '无数据')
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
  ipcMain.handle(
    '/book/getList',
    async function (_event, { page = 1, pageSize = 10, id = 0 }: bookListParams) {
      const params = {
        page,
        pageSize,
        id
      }
      const result = await getBookList(params)
      return result
    }
  )

  // 删除数据
  ipcMain.handle('/book/del', async function (_event, ids: string) {
    const result = await delBookList({ ids })

    if (result.success) {
      // 删除成功了， todo判断是否要把书籍存储的数据删除掉，现在先处理为删除
      function deleteDirectory(directoryPath) {
        fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
          if (err) throw err
          console.log('删除成功', directoryPath)
        })
      }
      result.data!.forEach((item) => deleteDirectory(item.path))
    }
    return result
  })
}
