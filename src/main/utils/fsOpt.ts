const fs = require('fs')

export const setLocalFile = async function ({
  directory,
  filePath,
  content
}: Record<string, string>): Promise<string> {
  // const directory = tmpFilePath
  // const filePath = `${directory}/${uuidv4()}`
  let result = filePath
  try {
    if (!fs.existsSync(directory)) {
      console.log(`目录 ${directory} 不存在，正在创建目录`)
      await fs.mkdirSync(directory, { recursive: true })
    }
    await fs.writeFileSync(filePath, content)
    console.log('文件已被写入文本')
  } catch (err) {
    console.log(err)
    result = ''
  }
  return result
}

export const removeLocalFile = async function (filePath: string): Promise<boolean> {
  try {
    if (fs.existsSync(filePath)) {
      await fs.unlinkSync(filePath)
      console.log(`文件 ${filePath} 已被删除`)
      return true
    } else {
      console.log(`文件 ${filePath} 不存在`)
      return false
    }
  } catch (err) {
    console.log(`删除文件 ${filePath} 时发生错误: ${err}`)
    return false
  }
}
