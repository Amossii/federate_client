import service from '@/utils/request'

// 上传文件前置检查
export const stat = (params) => {
  return service({
    url: '/stat',
    method: 'get',
    params,
    viewLoading: false
  })
}

export const getDomain = (params) => {
  return service({
    url: '/domain',
    method: 'get',
    params
  })
}

export const putDomain = (data) => {
  return service({
    url: '/domain',
    method: 'put',
    data
  })
}

export const getCache = (params) => {
  return service({
    url: '/cache',
    method: 'get',
    params
  })
}

export const deleteCache = (params) => {
  return service({
    url: '/cache',
    method: 'delete',
    params
  })
}

export const postControlHost = (data) => {
  return service({
    url: '/control/host',
    method: 'post',
    data
  })
}

export const getControlHost = (params) => {
  return service({
    url: '/control/host',
    method: 'get',
    params
  })
}

export const putControlHost = (data) => {
  return service({
    url: '/control/host',
    method: 'put',
    data
  })
}

export const deleteControlHost = (params) => {
  return service({
    url: '/control/host',
    method: 'delete',
    params
  })
}

export const installControlHost = (data) => {
  return service({
    url: '/control/host/install',
    method: 'put',
    data
  })
}

export const pushControlHost = (data) => {
  return service({
    url: '/control/host/push',
    method: 'put',
    data
  })
}

export const monitorControlHost = (params) => {
  return service({
    url: '/control/host/monitor',
    method: 'get',
    params
  })
}
export const addHost = (params) => {
  return service({
    url: '/client/add',
    method: 'get',
    params
  })
}
export const queryHost = (params) => {
  return service({
    url: '/client/query',
    method: 'get',
    params
  })
}
export const deleteHost = (params) => {
  return service({
    url: '/client/delete',
    method: 'get',
    params
  })
}
export const postConf = (data) => {
  return service({
    url: '/server/conf',
    method: 'post',
    data
  })
}
export const trainHost = (params) => {
  return service({
    url: '/client/train_save',
    method: 'get',
    params
  })
}
export const aggHost = (params) => {
  return service({
    url: '/server/aggregate',
    method: 'get',
    params
  })
}