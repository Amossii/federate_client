import service from '@/utils/request'

export const getSystemAdmin = (params) => {
  return service({
    url: '/auth/query',
    method: 'get',
    params
  })
}

export const addSystemAdmin = (params) => {
  return service({
    url: '/auth/register',
    method: 'get',
    params
  })
}

export const setSystemAdmin = (params) => {
  return service({
    url: '/auth/set',
    method: 'get',
    params
  })
}

export const deleteSystemAdmin = (params) => {
  return service({
    url: '/auth/delete',
    method: 'get',
    params
  })
}
