// 新增报备信息
import request from '@/utils/request'

export function addSeriousInfo(data) {
  return request({
    url: '/serious/info/',
    method: 'post',
    data: data
  })
}

export function getSeriousInfo() {
  return request({
    url: '/serious/info/',
    method: 'get',
  })
}

export function updateSeriousInfo(data) {
  return request({
    url: '/serious/info/',
    method: 'put',
    data: data
  })
}
