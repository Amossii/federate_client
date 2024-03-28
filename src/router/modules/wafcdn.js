import Layout from '@/views/layout/index.vue'

export const wafcdn = {
  path: '/wafcdn',
  component: Layout,
  redirect: '/wafcdn/stat',
  meta: { title: '联邦学习', icon: 'Postcard' },
  children: [
    {
      path: 'index',
      component: () => import('@/views/wafcdn/index.vue'),
      name: 'WafCdnIndex',
      meta: { title: '训练', icon: 'HelpFilled' }
    },
    {
      path: 'stat',
      component: () => import('@/views/wafcdn/stat.vue'),
      name: 'WafCdnStat',
      meta: { title: '可视化总览', icon: 'Odometer' }
    },
  ]
}
