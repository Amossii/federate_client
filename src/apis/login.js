import service from '@/utils/request'
// 获取系统验证码
export const postLogin = (params) => {
  return service({
    url: '/auth/login',
    method: 'post',
    params
  })
}
