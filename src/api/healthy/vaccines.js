import request from '@/utils/request'

// 查询疫苗列表
export function listVaccines() {
  return request({
    url: '/healthy/vaccines/list',
    method: 'get',
  })
}

export function checkVaccines() {
  return request({
    url: '/healthy/vaccines/checkVaccines',
    method: 'get',
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
