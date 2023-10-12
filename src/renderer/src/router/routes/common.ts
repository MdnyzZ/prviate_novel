export const NOT_FOUND = {
  name: 'notFound'
}

export const DEFAULT_LAYOUT = () => import('@renderer/components/Layout/DefaultLayout.vue')

export const RouterToMenuList = (routes) => {
  let tmps = routes.map((item) => {
    let children: Array<Record<string, any>> = []
    if (Array.isArray(item.children) && item.children.length) {
      children = item.children.map((e) => {
        return e.meta?.isMenu
          ? {
              title: e.meta.locale,
              icon: e.meta.icon,
              path: e.path,
              name: e.name
            }
          : undefined
      })
      children = children.filter(Boolean) as Array<Record<string, any>>
    }
    return item.meta?.isMenu
      ? {
          title: item.meta.locale,
          icon: item.meta.icon,
          path: item.path,
          name: item.name,
          children
        }
      : undefined
  })
  return tmps.filter(Boolean)
}

// export const PAGE_LOAYOUT = () => import('@/layout/page-layout.vue');
