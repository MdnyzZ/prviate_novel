import { IAnyResponse, listModeType } from '@commonTypes/apiTypes'

export const tocRule = [
  {
    id: 1,
    name: '目录',
    rule: /^[ 　\t]{0,4}(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张)))+\s{1,4}.{0,30}$/,
    order: 10
  },
  {
    id: 2,
    name: '目录(去空白)',
    rule: /(?<=[　\s])(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|篇(?!张)))+\s{1,4}.{0,30}$/,
    order: 5
  },
  {
    id: 3,
    name: '目录(匹配简介)',
    rule: /(?<=[　\s])(?:(?:内容|文章)?简介|文案|前言|序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|回(?![合来事去])|场(?![和合比电是])|篇(?!张)))+\s{1,4}.{0,30}$/,
    order: 15
  },
  {
    id: 4,
    name: '目录(古典、轻小说备用)',
    rule: /^[ 　\t]{0,4}(?:序章|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\s{0,4}[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(?:章|节(?![课两])|卷|集(?![合和])|部(?![剧分赛游])|回(?![合来事去])|场(?![和合比电是])|话|篇(?!张)))+\s{1,4}.{0,30}$/,
    order: 20
  },
  {
    id: 5,
    name: '数字(纯数字标题)',
    rule: /(?<=[　\s])\d+\.?[ 　\t]{0,4}$/,
    order: 25
  },
  {
    id: 6,
    name: '数字 分隔符 标题名称',
    rule: /^[ 　\t]{0,4}\d{1,5}[：:,.， 、_—\\-].{1,30}$/,
    order: 30
  },
  {
    id: 7,
    name: '大写数字 分隔符 标题名称',
    rule: /^[ 　\t]{0,4}(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|[〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8})[ 、_—\\-].{1,30}$/,
    order: 35
  },
  {
    id: 8,
    name: '正文 标题/序号',
    rule: /^[ 　\t]{0,4}正文[ 　]{1,4}.{0,20}$/,
    order: 40
  },
  {
    id: 9,
    name: 'Chapter/Section/Part/Episode 序号 标题',
    rule: /^[ 　\t]{0,4}(?:[Cc]hapter|[Ss]ection|[Pp]art|ＰＡＲＴ|[Nn][oO]\.|[Ee]pisode|(?:内容|文章)?简介|文案|前言|序章|楔子|正文(?!完|结)|终章|后记|尾声|番外)\s{0,4}\d{1,4}.{0,30}$/,
    order: 45
  },
  {
    id: 10,
    name: 'Chapter(去简介)',
    rule: /^[ 　\t]{0,4}(?:[Cc]hapter|[Ss]ection|[Pp]art|ＰＡＲＴ|[Nn][Oo]\.|[Ee]pisode)\s{0,4}\d{1,4}.{0,30}$/,
    order: 50
  },
  {
    id: 11,
    name: '特殊符号 序号 标题',
    rule: /(?<=[\s　])[【〔〖「『〈［\[](?:第|[Cc]hapter)[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,10}[章节].{0,20}$/,
    order: 55
  },
  {
    id: 12,
    name: '特殊符号 标题(成对)',
    rule: /(?<=[\s　]{0,4})(?:[\[〈「『〖〔《（【\(].{1,30}[\)】）》〕〗』」〉\]]?|(?:内容|文章)?简介|文案|前言|序章|楔子|正文(?!完|结)|终章|后记|尾声|番外)[ 　]{0,4}$/,
    order: 60
  },
  {
    id: 13,
    name: '特殊符号 标题(单个)',
    rule: /(?<=[\s　]{0,4})(?:[☆★✦✧].{1,30}|(?:内容|文章)?简介|文案|前言|序章|楔子|正文(?!完|结)|终章|后记|尾声|番外)[ 　]{0,4}$/,
    order: 65
  },
  {
    id: 14,
    name: '章/卷 序号 标题',
    rule: /^[ \t　]{0,4}(?:(?:内容|文章)?简介|文案|前言|序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|[卷章][0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8})[ 　]{0,4}.{0,30}$/,
    order: 70
  },
  {
    id: 15,
    name: '顶格标题',
    rule: /^\S.{1,20}$/,
    order: 75
  },
  {
    id: 16,
    name: '双标题(前向)',
    rule: /(?:[ \t　]{0,4})第[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}章.{0,30}$(?=[\s　]{0,8}第[0-9零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}章)/,
    order: 80
  },
  {
    id: 17,
    name: '双标题(后向)',
    rule: /(?:[ \t　]{0,4}第[0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}章[\s\S]{0,30}$[\s　]{0,8})第[0-9零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}章[\s\S]{0,30}$/,
    order: 85
  },
  {
    id: 18,
    name: '标题 特殊符号 序号',
    rule: /^.{1,20}[(（][0-9〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]{1,8}[)）][ 　\t]{0,4}$/,
    order: 90
  }
]

export const tocRules = tocRule.map((e) => e.rule)

export const ttsArr = [
  {
    params: {
      url: 'http://tts.baidu.com/text2audio',
      method: 'POST',
      body: 'tex={{text}}&per=106&cuid=baidu_speech_demo&idx=1&cod=2&lan=zh&ctp=1&pdt=301&vol=5&aue=3&pit=5&_res_tag_=audio'
    },
    name: '度博文'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=gdfanfp&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品女声 客服芳芳'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=zhilingfp&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品女声 小玲甜美女神'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=zxcmp&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品男声 风趣幽默星爷'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=gqlanfp&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品女声 温柔小兰'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=geyoump&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品男声 风趣淡定葛爷'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=ppangf_csn&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品女声 四川话胖胖'
  },
  {
    params: {
      url: 'https://dds.dui.ai/runtime/v1/synthesize?voiceId=gdgmfp&text={{text}}&&speed=10&volume=100&audioType=mp3',
      method: 'GET'
    },
    name: '思必驰 精品男声 郭德纲'
  }
]

export const RequestDefaultErrResult = (params: IAnyResponse = {}): IAnyResponse => {
  return {
    code: 400,
    msg: '系统错误',
    success: false,
    data: null,
    ...params
  }
}
export const RequestDefaultSucResult = (params: IAnyResponse = {}): IAnyResponse => {
  return {
    code: 200,
    msg: '加载成功',
    success: true,
    data: null,
    ...params
  }
}

export const DefaultListApiData = (params: listModeType<any[]> = {}): listModeType<any[]> => {
  return {
    list: [],
    total: 10,
    page: 1,
    pageSize: 10,
    ...params
  }
}
