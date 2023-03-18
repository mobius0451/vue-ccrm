import request from '@/utils/request'

// 查询入校申请列表
export function listEnter(query) {
  return request({
    url: '/access/enter/list',
    method: 'get',
    params: query
  })
}

// 查询入校申请详细
export function getEnter(enterId) {
  return request({
    url: '/access/enter/' + enterId,
    method: 'get'
  })
}

// 新增入校申请
export function addEnter(data) {
  return request({
    url: '/access/enter',
    method: 'post',
    data: data
  })
}

// 修改入校申请
export function updateEnter(data) {
  return request({
    url: '/access/enter',
    method: 'put',
    data: data
  })
}

// 删除入校申请
export function delEnter(enterId) {
  return request({
    url: '/access/enter/' + enterId,
    method: 'delete'
  })
}

