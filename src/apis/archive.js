import service from '@/utils/request'
const fileUrl = 'file/query'
// 新建资料



// 获取媒体列表
export const getArchive = (params) => {
  return service({
    url: 'file/query',
    method: 'get',
    params
  })
}
export const getModel = (params) => {
  return service({
    url: 'model/query',
    method: 'get',
    params
  })
}

export const deleteArchive = (params) => {
  return service({
    url: 'file/delete',
    method: 'get',
    params
  })
}

export const addArchiveTag = (data) => {
  return service({
    url: '/archive/list/tag',
    method: 'post',
    data
  })
}

export const deleteArchiveTag = (params) => {
  return service({
    url: '/archive/list/tag',
    method: 'delete',
    params
  })
}

/**
 * +++++++++++++++++++++++++++++
 * +    资料分类
 * +++++++++++++++++++++++++++++
 */

// 新建分类
export const addCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'post',
    data
  })
}

// 修改分类
export const updateCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'put',
    data
  })
}

// 获取分类
export const getCategory = (params) => {
  return service({
    url: '/archive/category',
    method: 'get',
    params
  })
}

export const deleteCategory = (params) => {
  return service({
    url: '/archive/category',
    method: 'delete',
    params
  })
}

/**
 * +++++++++++++++++++++++++++++
 * +    资料标签
 * +++++++++++++++++++++++++++++
 */

// 新建分类
export const addTag = (data) => {
  return service({
    url: '/archive/tag',
    method: 'post',
    data
  })
}

// 修改分类
export const updateTag = (data) => {
  return service({
    url: '/archive/tag',
    method: 'put',
    data
  })
}

// 获取分类
export const getTag = (params) => {
  return service({
    url: '/archive/tag',
    method: 'get',
    params
  })
}

export const deleteTag = (params) => {
  return service({
    url: '/archive/tag',
    method: 'delete',
    params
  })
}
