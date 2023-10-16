import { app, shell, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const fs = require('fs')
const os = require('os')

import { createDataTable } from './sql'
import { addBookList, getBookList } from './sql/sql-api/index'

// 初始化本地数据库
createDataTable()

// 创建窗口
function createWindow(): void {
  globalShortcut.register('f5', function () {
    mainWindow.reload()
  })
  globalShortcut.register('CommandOrControl+R', function () {
    mainWindow.reload()
  })
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// 内部使用API

// 读取txt
ipcMain.handle('getFiles', async function (event, path) {
  console.log('event', event)
  const result = await fs.readFileSync(path, 'utf8')

  return result.split(os.EOL)
})

// 读取文件
ipcMain.handle('readerFile', async function (event, path) {
  console.log('event', event)
  const result = await fs.readFileSync(path, 'utf8')

  return result.split(os.EOL)
})

// 打开弹窗、选择本地文件
ipcMain.handle('importBook', async function () {
  // 选择要读取的文件
  const dialogResult = await dialog.showOpenDialog({
    title: '选择导入的文件',
    filters: [{ name: 'txt', extensions: ['txt'] }],
    properties: ['openFile'],
    message: '选择导入的文件、目前仅支持txt格式'
  })
  // 读取的文件路径赋值
  const filePath = dialogResult.filePaths[0]
  if (!dialogResult.canceled && filePath) {
    // 选中了对应的文件
    const arr = filePath.split('/')
    const title = arr[arr.length - 1]?.split('.')?.[0]
    // const result = await fs.readFileSync(filePath, 'utf8')
    const result = await addBookList({ title })
    console.log('result============', result)
    const result2 = await getBookList({})
    console.log('result2============', result2)
    return result
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

// 打开弹窗、选择本地文件
ipcMain.handle('getBookList', async function (event, { page = 1, pageSize = 10, id = '' }) {
  const params = {
    page,
    pageSize,
    id
  }
  const result = await getBookList(params)
  return result
})
