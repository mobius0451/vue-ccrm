import request from '@/utils/request'

// 上传图片
export function upload(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}

// 上传图片(多个上传)
export function uploads(data) {
  return request({
    url: '/common/uploads',
    method: 'post',
    processData: false,
    contentType: false,
    data: data
  })
}
