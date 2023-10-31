import { DEFAULT_LAYOUT } from '../common';
import { AppRouteRecordRaw } from '@commonTypes/router';

const FOUNDER: AppRouteRecordRaw = {
  path: '/found',
  name: 'found',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '寻书',
    icon: 'icon-dashboard',
    order: 2,
    isMenu: true
  },
  children: [
    {
      name: 'orginSearch',
      path: '/found/orginSearch',
      component: () => import('@renderer/views/orginSearch/index.vue'),
      meta: {
        locale: '书源搜书',
        order: 1,
        isMenu: true
      },
    },
    {
      name: 'webSearch',
      path: '/found/webSearch',
      component: () => import('@renderer/views/webSearch/index.vue'),
      meta: {
        locale: '全网搜书',
        order: 2,
        isMenu: true
      },
    },
  ],
};

export default FOUNDER;
