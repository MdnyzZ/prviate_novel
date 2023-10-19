// import { DEFAULT_LAYOUT } from '../common';
// import { AppRouteRecordRaw } from '@commonTypes/router';
import type { RouteRecordRaw } from 'vue-router'

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@renderer/views/notFound/index.vue')
}

export const THIEF_BOOK_READER: RouteRecordRaw = {
  path: '/thiefBookReader',
  name: 'thiefBookReader',
  component: () => import('@renderer/views/thiefBookReader/index.vue')
}

export default [THIEF_BOOK_READER]
