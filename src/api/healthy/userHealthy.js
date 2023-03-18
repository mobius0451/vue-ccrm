import request from '@/utils/request'

export function listUserHealthy(query) {
  return request({
      url: '/healthy/userHealthy/list',
      method: 'get',
      params: query,
    }
  )
}
