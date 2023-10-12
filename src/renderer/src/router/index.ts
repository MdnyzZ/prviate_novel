import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

import { appRoutes } from './routes'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

console.log('appRoutes', appRoutes)

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/layout/bookshelf'
    },
    ...appRoutes
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
