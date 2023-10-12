// import { DEFAULT_LAYOUT } from '../common';
// import { AppRouteRecordRaw } from '@renderer/types/router';
import type { RouteRecordRaw } from 'vue-router';

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@renderer/views/notFound/index.vue'),
};
