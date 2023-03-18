import request from '@/utils/request'

// 查询报备列表
export function listInfected() {
  return request({
    url: '/healthy/infected/list',
    method: 'get',
  })
}

// 查询报备列表
export function checkInfected() {
  return request({
    url: '/healthy/infected/checkInfected',
    method: 'get',
  })
}


// // 新增
// export function addReport(data) {
//   return request({
//     url: '/healthy/report/',
//     method: 'post',
//     data: data
//   })
// }


// // 删除
// export function delReport(reportId) {
//   return request({
//     url: '/healthy/report/' + reportId,
//     method: 'delete'
//   })
// }
