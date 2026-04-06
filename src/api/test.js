import request from '@/utils/request'

export function updateMsg(data) {
  return request({
    url: '/test',
    method: 'post',
    params: {
      param: data
    }
  })
}
