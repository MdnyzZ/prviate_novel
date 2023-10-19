const sqlite3 = require('sqlite3')
// const NODE_ENV = process.env.NODE_ENV
const path = require('path')
const { app } = require('electron')

let DB_PATH = path.join(app.getAppPath(), '/resources/db/index.db')

console.log('连接数据库路径：', app.getAppPath())
console.log('连接数据库路径：', DB_PATH)

// 判断是否是正式环境
if (app.isPackaged) {
  // 正式环境
  DB_PATH = path.join(path.dirname(app.getPath('exe')), '/resources/db/index.db')
}

//连接数据库
export const connectDatabase = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('连接数据库错误：' + err.message)
    }
    console.log('连接数据库成功')
  })
}

// 创建数据库
export const createDataTable = () => {
  return new Promise((resolve) => {
    const db = connectDatabase()
    db.serialize(() => {
      // 初始化数据库
      // todo 书签（章节文件名、关键文本），最近阅读位置（章节文件名、关键文本）
      db.run(
        `create table 
          if not exists 
            book_list (
              id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              title NTEXT DEFAULT null,
              image varcar(64) DEFAULT null,
              create_time varchar(64) DEFAULT null,
              path varchar(2000) DEFAULT null,
              directory NTEXT DEFAULT null
            )
        `
      )
      resolve(undefined)
    })
  })
}
