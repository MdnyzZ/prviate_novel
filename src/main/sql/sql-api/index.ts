const modules = import.meta.glob('./modules/*.ts', { eager: true })

const getModeluesName = (url) => {
  let index = url.lastIndexOf('/')
  return url.substring(index + 1).split('.')[0]
}

const formatModules = (_modules: any, result: Record<string, Record<string, Function>>) => {
  Object.keys(_modules).forEach((path) => {
    const key = getModeluesName(path)
    result[key] = { ..._modules[path] }
  })
  return result
}

const sqlApi = formatModules(modules, {})

export default sqlApi
