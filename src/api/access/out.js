import request from '@/utils/request'

// 查询出校申请列表
export function listOut(query) {
  return request({
    url: '/access/out/list',
    method: 'get',
    params: query
  })
}

// 查询出校申请详细
export function getOut(outId) {
  return request({
    url: '/access/out/' + outId,
    method: 'get'
  })
}

// 新增出校申请
export function addOut(data) {
  return request({
    url: '/access/out',
    method: 'post',
    data: data
  })
}

// 修改出校申请
export function updateOut(data) {
  return request({
    url: '/access/out',
    method: 'put',
    data: data
  })
}

// 删除出校申请
export function delOut(outId) {
  return request({
    url: '/access/out/' + outId,
    method: 'delete'
  })
}

