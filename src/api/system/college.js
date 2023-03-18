import request from '@/utils/request'

// 查询部门列表
export function listCollege(query) {
  return request({
    url: '/system/college/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listCollegeExcludeChild(collegeId) {
  return request({
    url: '/system/college/list/exclude/' + collegeId,
    method: 'get'
  })
}

// 查询部门详细
export function getCollege(collegeId) {
  return request({
    url: '/system/college/' + collegeId,
    method: 'get'
  })
}

// 新增部门
export function addCollege(data) {
  return request({
    url: '/system/college',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateCollege(data) {
  return request({
    url: '/system/college',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delCollege(collegeId) {
  return request({
    url: '/system/college/' + collegeId,
    method: 'delete'
  })
}
