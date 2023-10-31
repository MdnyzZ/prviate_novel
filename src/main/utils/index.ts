// 解析失败返回-1，成功返回转换后的数字，不支持负数
function chinese_number_to_digit(chinese_number: string = ''): number {
  if (/^\d+$/g.test(chinese_number)) return Number(chinese_number)
  let map = {
    〇: 0,
    零: 0,

    一: 1,
    壹: 1,

    二: 2,
    贰: 2,
    两: 2,

    三: 3,
    叁: 3,

    四: 4,
    肆: 4,

    五: 5,
    伍: 5,

    六: 6,
    陆: 6,

    七: 7,
    柒: 7,

    八: 8,
    捌: 8,

    九: 9,
    玖: 9,

    十: 10,
    拾: 10,

    百: 100,
    佰: 100,

    千: 1000,
    仟: 1000,

    万: 10000,
    十万: 100000,
    百万: 1000000,
    千万: 10000000,
    亿: 100000000
  }
  let len = chinese_number.length
  if (len == 0) return -1
  if (len == 1) return map[chinese_number] <= 10 ? map[chinese_number] : -1
  // 返回的总和
  let summary = 0

  // 十开头省略一的情况 例 `十二` 和 `一十二`
  if (map[chinese_number[0]] == 10) {
    chinese_number = '一' + chinese_number
    len++
  }

  // 单位结尾，省略末尾单位的情况  例 一万二  三千一 二百五
  if (len >= 3 && map[chinese_number[len - 1]] < 10) {
    let last_second_num = map[chinese_number[len - 2]]
    if (
      last_second_num == 100 ||
      last_second_num == 1000 ||
      last_second_num == 10000 ||
      last_second_num == 100000000
    ) {
      for (let key in map) {
        if (map[key] == last_second_num / 10) {
          chinese_number += key
          len += key.length
          break
        }
      }
    }
  }

  // 不支持 一亿亿xxx  十亿亿xx ...
  if ((chinese_number.match(/亿/g) || []).length > 1) return -1

  // 处理一亿以上的情况 例 三百二十三亿三千二百万两千零二十二
  let splited = chinese_number.split('亿')
  if (splited.length == 2) {
    let rest = splited[1] == '' ? 0 : chinese_number_to_digit(splited[1])
    return summary + chinese_number_to_digit(splited[0]) * 100000000 + rest
  }

  // 下面处理小于一亿的情况 例 三千二百万两千零二十二
  splited = chinese_number.split('万')
  if (splited.length == 2) {
    let rest = splited[1] == '' ? 0 : chinese_number_to_digit(splited[1])
    return summary + chinese_number_to_digit(splited[0]) * 10000 + rest
  }

  // 下面处理小于一万的情况 例 两千零二十二
  let i = 0
  while (i < len) {
    let first_char_num = map[chinese_number[i]]
    let second_char_num = map[chinese_number[i + 1]]
    if (second_char_num > 9) summary += first_char_num * second_char_num
    i++
    if (i == len) summary += first_char_num <= 9 ? first_char_num : 0
  }
  return summary
}
export const doChapterNameUnify = (
  datas: string
): {
  datas: string
  sort: number
} => {
  let reg1 = new RegExp(
    /(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张)))+\s{1,4}.{0,30}/
  )
  let reg2 = new RegExp(
    /[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张))/,
    'g'
  )

  let reg3 = new RegExp(
    /(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张))+\s{1,4}.[^第]{0,30}/,
    'g'
  )

  if (reg1.test(datas)) {
    let numsArr = datas.match(reg2) || []
    let titleArr = datas.match(reg3) || []
    let nums = ''
    let num = 0
    let title = ''
    if (numsArr.length) {
      nums = numsArr[numsArr.length - 1]
      nums = nums.length > 1 ? nums.slice(0, -1) : nums
      num = chinese_number_to_digit(nums)
    }
    if (titleArr.length) {
      title = titleArr[titleArr.length - 1].substring(1).trim()
    }
    return {
      datas: `第${num}章 ${title}`,
      sort: num
    }
  } else {
    return {
      datas: datas,
      sort: 0
    }
  }
}
