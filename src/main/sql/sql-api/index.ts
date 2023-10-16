import { connectDatabase } from '../index'
import moment from 'moment'

// 书籍列表 新增
export const addBookList = ({ title, image = '', path = '' }) => {
  let db = connectDatabase()
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  return new Promise((resolve, reject) => {
    let inquire = `select * from book_list where title = "${title}" and path = "${path}"`
    db.all(inquire, (err, list) => {
      // 查询用户
      if (err) {
        reject({ code: 400, msg: err, success: false, data: [] })
      } else {
        if (list.length) {
          // 有对应书籍
          resolve({ code: 201, msg: '书籍已存在书架中', success: false, data: list })
        } else {
          // 没有对应书籍
          let sql = `INSERT INTO book_list (title, image, create_time, path) `
          sql += `values ("${title}", "${image}", "${create_time}", "${path}")`
          db.all(sql, (error, data) => {
            if (error) {
              reject({ code: 400, success: false, msg: error })
            } else {
              resolve({ code: 200, success: true, msg: '成功', data })
            }
          })
        }
      }
    })
  })
}

// 书籍列表 查询
export const getBookList = ({ page = 1, pageSize = 10, id = '' }) => {
  let db = connectDatabase()
  // 获取total语法
  let totalSql = `select count(*) total from book_list`
  let total = 0
  return new Promise((resolve, reject) => {
    // 统计总数
    db.all(totalSql, (err, totalData) => {
      if (err) {
        reject({ code: 200, msg: err, success: false, data: '总计条数错误' })
      }
      total = totalData[0].total
    })
    // 实现分页语法
    let sql = `select * from book_list`
    if (id) {
      sql += ` where id = "${id}"`
    }
    sql += ` limit ${(page - 1) * pageSize},${pageSize}`
    db.all(sql, (error, data) => {
      if (error) {
        reject({ code: 400, success: false, msg: error })
      } else {
        resolve({ code: 200, success: true, msg: '成功', data })
      }
    })
  })
}

// 书籍列表 删除
export const delBookList = ({ id }) => {
  const sql = `DELETE FROM book_list WHERE id = ${id}`
  const weightSql = `select * from book_list where id = ${id}`
  return new Promise((resolve, reject) => {
    if (!id) {
      reject({ code: 400, msg: '请传入书籍id', data: [] })
      return
    }
    let db = connectDatabase()
    db.all(weightSql, (err, list) => {
      if (err) {
        reject({ code: 400, msg: err, success: false, data: [] })
      } else {
        if (list.length) {
          db.all(sql, (error) => {
            if (error) {
              reject({ code: 400, success: false, msg: error })
            } else {
              resolve({ code: 200, success: true, msg: '删除成功', data: list })
            }
          })
        } else {
          resolve({ code: 400, success: false, msg: `书籍不存在` })
        }
      }
    })
  })
}
