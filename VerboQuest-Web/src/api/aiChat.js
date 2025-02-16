import request from '@/utils/request'

export const aiGen = (id, word) => {
  return request({
    url: '/ai/' + id + '/aiGen?message=' + word,
    method:'GET'
  })
}