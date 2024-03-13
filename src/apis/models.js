import service from '@/utils/request'

export const getModel = (params) => {
  return service({
    url: 'model/query',
    method: 'get',
    params
  })
}
export const deleteModel=(params)=>{
    return service({
        url:'model/delete',
        method:'get',
        params

    })
}