import service from '@/utils/request'

// 登出
export const postLogout = () => {
  return service({
    url: '/auth/logout',
    method: 'get'
  })
}
