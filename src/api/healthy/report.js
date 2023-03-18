import request from '@/utils/request'

// 查询报备列表
export function listReport(query) {
  return request({
    url: '/healthy/report/list',
    method: 'get',
    params: query
  })
}

// 查询今日是否报备
export function todayReport() {
  return request({
    url: '/healthy/report/todayReport',
    method: 'get'
  })
}

// 新增报备信息
export function addReport(data) {
  return request({
    url: '/healthy/report/',
    method: 'post',
    data: data
  })
}


// 删除报备信息
export function delReport(reportId) {
  return request({
    url: '/healthy/report/' + reportId,
    method: 'delete'
  })
}
