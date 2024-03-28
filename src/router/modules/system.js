import Layout from '@/views/layout/index.vue'

export const dashboard = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      name: 'Dashboard',
      meta: { title: '主页', icon: 'Odometer' , }
    },
    
  ]
}

export const system = {
  path: '/system',
  component: Layout,
  redirect: '/system/administrator',
  children: [
    {
      path: 'administrator',
      component: () => import('@/views/system/administrator.vue'),
      name: 'SystemAdministrator',
      meta: { title: '用户管理', icon: 'User' ,requiresAuth:true,hidden: true}
    },
    
  ]
}
