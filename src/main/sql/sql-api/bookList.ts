import { connectDatabase } from '../index'
import moment from 'moment'
import {
  RequestDefaultErrResult,
  RequestDefaultSucResult,
  DefaultListApiData
} from '../../common/index'
import { IResponse } from '@commonTypes/common'
import { IBooleanResponse, IBookListResponse, bookListType } from '@commonTypes/apiTypes'
import { bookListParams } from '@commonTypes/apiRequest'

// 书籍列表 新增
export const addBookList = ({
  title,
  image = '',
  path = '',
  directory = '[]'
}): Promise<IBooleanResponse> => {
  let db = connectDatabase()
  const create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  return new Promise((resolve, reject) => {
    let inquire = `select * from book_list where title = "${title}" and path = "${path}"`
    db.all(inquire, (err, list) => {
      // 查询用户
      if (err) {
        reject(RequestDefaultErrResult({ msg: err }))
      } else {
        if (list.length) {
          // 有对应书籍
          resolve(RequestDefaultErrResult({ code: 201, msg: '书籍已存在书架中' }))
        } else {
          // 没有对应书籍
          let sql = `INSERT INTO book_list (title, image, create_time, path, directory) `
          sql += `values ("${title}", "${image}", "${create_time}", "${path}", "${encodeURIComponent(
            directory
          )}")`
          db.all(sql, (error) => {
            if (error) {
              reject(RequestDefaultErrResult({ msg: error }))
            } else {
              resolve(RequestDefaultSucResult({ data: true }))
            }
          })
        }
      }
    })
  })
}

// 书籍列表 查询
export const getBookList = ({
  page = 1,
  pageSize = 10,
  id = 0
}: bookListParams): Promise<IBookListResponse> => {
  let db = connectDatabase()
  // 获取total语法
  let totalSql = `select count(*) total from book_list`
  let total = 0
  return new Promise((resolve, reject) => {
    // 统计总数
    db.all(totalSql, (err, totalData) => {
      if (err) {
        reject(RequestDefaultErrResult({ code: 200, msg: '总计条数错误' }))
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
        reject(RequestDefaultErrResult({ code: 400, msg: error }))
      } else {
        const Datas = DefaultListApiData({
          list: data.map((item) => {
            if (item.directory) {
              item.directory = JSON.parse(decodeURIComponent(item.directory) || '[]')
            }
            return item
          }),
          total: total,
          page: page,
          pageSize: pageSize
        })
        resolve(RequestDefaultSucResult({ data: Datas }))
      }
    })
  })
}

// 书籍列表 删除
export const delBookList = ({ ids }): Promise<IResponse<bookListType[] | undefined>> => {
  const sql = `DELETE FROM book_list WHERE id IN (${ids})`
  const weightSql = `select * from book_list where id IN (${ids})`
  return new Promise((resolve, reject) => {
    if (!ids) {
      reject(RequestDefaultErrResult({ msg: '请传入书籍id' }))
      return
    }
    let db = connectDatabase()
    db.all(weightSql, (err, list) => {
      if (err) {
        reject(RequestDefaultErrResult({ msg: err }))
      } else {
        if (list.length) {
          db.all(sql, (error) => {
            if (error) {
              reject(RequestDefaultErrResult({ msg: error }))
            } else {
              resolve(
                RequestDefaultSucResult({
                  msg: '删除成功',
                  data: list.map((item) => {
                    if (item.directory) {
                      item.directory = JSON.parse(decodeURIComponent(item.directory) || '[]')
                    }
                    return item
                  })
                })
              )
            }
          })
        } else {
          resolve(RequestDefaultErrResult({ msg: '书籍不存在' }))
        }
      }
    })
  })
}
