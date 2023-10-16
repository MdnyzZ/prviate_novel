import { DEFAULT_LAYOUT } from '../common';
import { AppRouteRecordRaw } from '@commonTypes/router';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/layout',
  name: 'layout',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '基础',
    icon: 'icon-dashboard',
    order: 1,
    isMenu: true
  },
  children: [
    {
      name: 'bookshelf',
      path: '/layout/bookshelf',
      component: () => import('@renderer/views/bookshelf/index.vue'),
      meta: {
        locale: '书架',
        order: 1,
        isMenu: true
      },
    },
    {
      name: 'bookDetails',
      path: '/layout/bookDetails',
      component: () => import('@renderer/views/bookDetails/index.vue'),
      meta: {
        locale: '书籍详情',
        isMenu: false
      },
    },
  ],
};

export default DASHBOARD;
