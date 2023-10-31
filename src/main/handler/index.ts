const fs = require('fs')
const os = require('os')
const path = require('path')
import { ipcMain, dialog, app, BrowserWindow, BrowserView } from 'electron'
import { is } from '@electron-toolkit/utils'
import { tocRules } from '@mainsPage/common/index'
import { setLocalFile, removeLocalFile } from '@mainsPage/utils/fsOpt'
import { doChapterNameUnify } from '@mainsPage/utils/index'
import { addBookList, getBookList, delBookList } from '../sql/sql-api/bookList'
import { bookListParams } from '@commonTypes/apiRequest'
// import { IResponse } from '@commonTypes/common'
import {
  openBroswerViewParams,
  browserOptParams,
  browserOptResult,
  browserOptParamsType,
  browserOptParamsOpt,
  analysisMenuType
} from '@commonTypes/handle'
import { bookListItemRightClick } from '../menu'
import puppeteer from 'puppeteer'
import { v4 as uuidv4 } from 'uuid'
const appBasePath = app.getAppPath()
let bookStorePath = path.join(appBasePath, '/resources/book')
let tmpFilePath = path.join(appBasePath, '/resources/tmp')

// 内部使用API
export const initIpcMainHandle = () => {
  // 读取txt
  // todo 判断文件的编码格式，转码成utf-8的字符串后返回出去
  ipcMain.handle('getFiles', async function (_event, path: string): Promise<string> {
    const result = await fs.readFileSync(path, 'utf8')

    return result.split(os.EOL)
  })

  // 读取文件
  ipcMain.handle('getLocalFile', async function (_event, path: string): Promise<string> {
    return await fs.readFileSync(path, 'utf8')
  })

  // 设置文件
  ipcMain.handle(
    'setLocalFile',
    async function (_event, { content }: Record<string, string>): Promise<string> {
      return await setLocalFile({
        directory: tmpFilePath,
        filePath: `${tmpFilePath}/${uuidv4()}`,
        content: content
      })
    }
  )

  // 删除文件
  ipcMain.handle('removeLocalFile', async function (_event, filePath: string): Promise<boolean> {
    return await removeLocalFile(filePath)
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

  ipcMain.handle('openBroswerView', function (_event, params: openBroswerViewParams) {
    const { x, y, width, height, url } = params
    const current = BrowserWindow.getFocusedWindow()
    if (!current) return

    const view = new BrowserView()
    current.setBrowserView(view)
    view.setBounds({ x, y, width, height })
    view.setAutoResize({
      width: true,
      height: true
    })
    view.webContents.loadURL(url)
    view.webContents.setWindowOpenHandler((details) => {
      if (details.url) view.webContents.loadURL(details.url)
      return { action: 'deny' } //取消创建新窗口
    })
  })

  ipcMain.handle(
    'broswerOption',
    function (_event, params: browserOptParams): Partial<browserOptResult> {
      const { type, opt } = params
      const mainWindow = BrowserWindow.getFocusedWindow()
      if (!mainWindow) return {}
      // 默认为window
      let contents: Electron.WebContents | null = mainWindow.webContents
      if (type == browserOptParamsType.VIEW) {
        const view = mainWindow.getBrowserView()
        contents = view?.webContents || null
      } else {
        contents = null
      }
      if (!contents) return {}

      if (opt == browserOptParamsOpt.BACK && contents.canGoBack()) {
        contents.goBack()
      } else if (opt == browserOptParamsOpt.FORWARD && contents.canGoForward()) {
        contents.goForward()
      }

      return {
        canGoBack: contents.canGoBack(),
        canGoForward: contents.canGoForward()
      }
    }
  )

  ipcMain.handle('closeCurrentBroswerView', function (_event) {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (!mainWindow) return
    const view = mainWindow.getBrowserView()
    if (view?.webContents) {
      // 保障移除占位
      view.webContents.close()
      mainWindow.removeBrowserView(view)
    }
  })

  ipcMain.handle('getCurrentBroswerViewUrl', async function (_event) {
    const mainWindow = await BrowserWindow.getFocusedWindow()

    if (!mainWindow) return ''
    const view = await mainWindow.getBrowserView()

    if (view?.webContents) {
      return view.webContents?.getURL() || ''
    } else {
      return ''
    }
  })

  ipcMain.handle('setCurrentBroswerViewUrl', function (_event, url: string): unknown {
    const mainWindow = BrowserWindow.getFocusedWindow()

    if (!mainWindow) return ''
    const view = mainWindow.getBrowserView()

    if (view?.webContents) {
      return view.webContents.loadURL(url)
    } else {
      return ''
    }
  })

  ipcMain.handle('analysisWebToMenu', async function (_event, url: string): Promise<
    analysisMenuType[]
  > {
    const browser = await puppeteer.launch({
      headless: false
    })
    try {
      const page = await browser.newPage()

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })

      // 解析到了目录的文字
      const partNameArr = await page.evaluate(() => {
        // 注入loading
        // const link = document.createElement('link')
        // link.rel = 'stylesheet'
        // link.href = '//unpkg.com/layui@2.6.8/dist/css/layui.css'
        // document.documentElement.appendChild(link)

        // const script = document.createElement('script')
        // script.src = '//unpkg.com/layui@2.6.8/dist/layui.js'
        // document.documentElement.appendChild(script)

        // const script2 = document.createElement('script')
        // script2.innerHTML = 'setTimeout(() => {layer.load(2)}, 6000)'
        // document.documentElement.appendChild(script2)
        // 注入loading End

        let allTextNodes: any[] = []
        // 匹配到章节的文案
        Array.from(document.childNodes).forEach((node) => {
          const regex =
            /(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张)))+\s{1,4}.{0,30}/gm
          const match = (node.textContent || '').match(regex)
          if (match) allTextNodes = allTextNodes.concat(match)
        })
        return allTextNodes
      })

      // 循环去通过文案找一下对应的dom, 并获取详情href
      let menus: analysisMenuType[] = []
      if (partNameArr?.length) {
        let textNodesMaps = new Map()
        for (let index = 0; index < partNameArr.length; index++) {
          const text = partNameArr[index]
          const ele = await page.$x(`//*[contains(text(), "${text}")]`)
          if (ele[0]) {
            const src = await ele[0].evaluate((el) => {
              // @ts-ignore
              if (el.nodeName == 'A' && el.getAttribute('href')) {
                // @ts-ignore
                let href = el!.getAttribute('href')
                // 校验一下，如果href第一个为/则根据源来拼接、如果不为/则根据现有路径直接拼接
                let firstHrefWord = href.substring(0, 1)
                let src = ''
                if (firstHrefWord == '/') {
                  src = window.location.origin + href
                } else {
                  window.location.href + href
                }
                return src
              } else {
                return ''
              }
            }, ele[0])
            // 重复章节移除、且src存在才保存
            if (src && !textNodesMaps.get(text)) {
              textNodesMaps.set(text, true)

              const { datas, sort } = doChapterNameUnify(text)
              menus.push({
                src: src,
                title: datas,
                sort: sort
              })
            }
          }
        }
      }

      if (menus.length) {
        menus.sort((a, b) => a.sort - b.sort)
        // 如何把参数传递过去、存储一个本地文件、然后在页面内部去访问，并删除
        // await setLocalFile({
        //   directory: tmpFilePath,
        //   filePath: `${tmpFilePath}/${uuidv4()}`,
        //   content: JSON.stringify(menus || [])
        // })
      }
      await browser.close()
      // 返回目录列表
      return menus
    } catch (error) {
      console.log(error)
      await browser.close()
      return []
    }
  })

  // 向View窗口发送alert
  ipcMain.handle('touchViewOpenAlert', async function (_event, message: string) {
    const mainWindow = await BrowserWindow.getFocusedWindow()
    if (!mainWindow) return
    const view = await mainWindow.getBrowserView()
    if (view) view.webContents.executeJavaScript(`alert('${message}')`)
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
