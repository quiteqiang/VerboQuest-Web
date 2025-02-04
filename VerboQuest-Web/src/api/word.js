import request from '@/utils/request'

export const recordWord = (data) => {
  return request({
    url: '/word',
    method:'post',
    data
  })
}