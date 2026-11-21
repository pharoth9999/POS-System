import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import CashierLayout from '@/layouts/CashierLayout.vue'
import { i18n } from '@/locales'

import './meta'

/**
 * Pages are lazy-loaded, so each view is its own chunk. Layouts are parent
 * routes: AdminLayout (sidebar back office) and CashierLayout (full-screen
 * POS). There is no login or role guard right now: every page is open.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/pos',
    component: CashierLayout,
    children: [
      {
        path: '',
        name: 'pos',
        component: () => import('@/views/PosView.vue'),
        meta: { title: 'nav.pos' },
      },
    ],
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', name: 'home', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'nav.dashboard' },
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/ProductsView.vue'),
        meta: { title: 'nav.products' },
      },
      {
        path: 'stock',
        name: 'stock',
        component: () => import('@/views/StockView.vue'),
        meta: { title: 'nav.stock' },
      },
      {
        path: 'transfers',
        name: 'transfers',
        component: () => import('@/views/TransfersView.vue'),
        meta: { title: 'nav.transfers' },
      },
      {
        path: 'members',
        name: 'members',
        component: () => import('@/views/MembersView.vue'),
        meta: { title: 'nav.members' },
      },
      {
        path: 'debts',
        name: 'debts',
        component: () => import('@/views/DebtsView.vue'),
        meta: { title: 'nav.debts' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/ReportsView.vue'),
        meta: { title: 'nav.reports' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/UsersView.vue'),
        meta: { title: 'nav.users' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: 'nav.settings' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const appName = i18n.global.t('app.name')
  document.title = to.meta.title ? `${i18n.global.t(to.meta.title)} · ${appName}` : appName
})

export default router
