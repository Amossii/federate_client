import Layout from '@/views/layout/index.vue'

export const video = {
  path: '/video',
  component: Layout,
  redirect: '/video/index',
  children: [
    {
      path: 'file',
      component: () => import('@/views/video/file.vue'),
      name: 'videoFile',
      meta: { title: '文件上传', icon: 'Files' }
    },
  ]
}

export const archive = {
  path: '/archive',
  component: Layout,
  redirect: '/archive/index',
  children: [
    {
      path: 'list',
      component: () => import('@/views/archive/list.vue'),
      name: 'archiveList',
      meta: { title: '模型列表', icon: 'Memo' }
    },
  ]
}
