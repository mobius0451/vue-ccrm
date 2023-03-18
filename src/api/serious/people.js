import request from '@/utils/request'

// 查询列表
export function listPeople(query) {
  return request({
    url: '/serious/people/list',
    method: 'get',
    params: query
  })
}


// // 新增报备信息
// export function addReport(data) {
//   return request({
//     url: '/healthy/report/',
//     method: 'post',
//     data: data
//   })
// }
//
//
// // 删除公告
// export function delReport(reportId) {
//   return request({
//     url: '/healthy/report/' + reportId,
//     method: 'delete'
//   })
// }
