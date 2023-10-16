import type { RouteRecordNormalized } from 'vue-router'
import { MenuType } from '@commonTypes/router'

const modules = import.meta.glob('./modules/*.ts', { eager: true })
import { RouterToMenuList } from './common'

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

const appRoutes: RouteRecordNormalized[] = formatModules(modules, [])
const menuList: MenuType[] = RouterToMenuList(appRoutes)
console.log('menuList', menuList)
export { appRoutes, menuList }
export type {
  MenuType
}
